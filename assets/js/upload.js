window.addEventListener('load', function () {
    let contacts = []
    document.getElementById('tar-upload-input').addEventListener('change',function (e) {
        let table = document.getElementById('skype-table'),
            tbody = table.getElementsByTagName('tbody')[0]

        // Clear table if file already uploaded
        if (tbody.rows.length > 0) {
            for (let i = tbody.rows.length; i > 0; i--) {
                tbody.deleteRow(tbody.rows[i])
            }
        }

        let callInformationArray = [],
            combinedCallsArray = [],
            reader = new FileReader()

        reader.onload = function(event) {
            let skypeJsonObject = JSON.parse(event.target.result),
                skypeConversation = skypeJsonObject.conversations

            const callEvents = getAllCallEvents(skypeConversation)
            callEvents.forEach(call => {
                let callObject = createCallInformationObject(call)
                if (callObject) {
                    contacts = createContactList(contacts, callObject)
                    callInformationArray.push(callObject)
                }
            })

            for (let i = 0; i < callInformationArray.length; i++) {
                let currentId = callInformationArray[i].callId
                let result = callInformationArray.filter(o => o.callId === currentId)

                if (result.length > 1) {
                    let combinedCall = combineCalls(result)
                    if (combinedCall) {
                        combinedCallsArray.push(combinedCall)
                    }
                }
            }
            let distinctCalls = getUniqueCalls(combinedCallsArray)

            displayResultsAsTable(distinctCalls, 'skype-table')
            populateCallRemoval(contacts, 'select-remove')
            populateCallRemoval(contacts, 'name-being-changed-select')
            populateHiddenField(contacts, 'contacts-hidden')
        }
        reader.readAsText(e.target.files[0]);
    })
})

/**
 * Creates contact list from unique contacts in calls
 * @param {Array} contactListArray
 * @param {Object} callObject
 * @returns
 */
function createContactList(contactListArray, callObject) {
     if (contactListArray.indexOf(callObject.participentOne) === -1) {
        contactListArray.push(callObject.participentOne)
    }
    if (contactListArray.indexOf(callObject.participentTwo) === -1) {
        contactListArray.push(callObject.participentTwo)
    }

    return contactListArray
}

/**
 * Fetches Unique calls in array
 * @param {Array} arrayOfCalls
 * @returns
 */
function getUniqueCalls(arrayOfCalls) {
    let distinctCall = {}
    let distinctCalls = arrayOfCalls.filter(function (entry) {
        if (distinctCall[entry.callId]) {
            return false
        }
        distinctCall[entry.callId] = true
        return true
    })

    return distinctCalls
}

/**
 * Combines calls into one object
 * @param {Array} arrayCalls
 * @returns object of one call, or an array of missed calls
 */
function combineCalls(arrayCalls) {
    let callStart,
        endCall
    let missedCalls = []

    arrayCalls.forEach(el => {
        if (el.callType === 'ended') {
            endCall = el
        }
        if (el.callType === 'started') {
            callStart = el
        }
        if (el.callType === 'missed') {
            missedCalls.push(el)
        }
    })

    if (missedCalls.length > 0 || !endCall) {
        return
    }

    let combinedCall = {}

    combinedCall.timeStarted = callStart.callDate
    combinedCall.timeEnded = endCall.callDate
    combinedCall.whoStartedCall = callStart.whoStartedCall
    combinedCall.duration = endCall.duration
    combinedCall.participentOne = callStart.participentOne
    combinedCall.participentTwo = callStart.participentTwo
    combinedCall.callId = callStart.callId
    combinedCall.date = callStart.callDate

    return combinedCall
}

/**
 * Gets all the calls from every conversation
 * @param {Array} conversations
 */
function getAllCallEvents(conversations) {
    let callEvents = []
    conversations.forEach(conversation => {
        conversation.MessageList.forEach(message => {
            if (message.messagetype === 'Event/Call') {
                callEvents.push(message)
            }
        })
    })

    return callEvents
}

/**
 * Creates the call information object from the Skype Import data
 * @param {Object} call
 * @returns CallInformationObject with filled data
 */
function createCallInformationObject(call) {
    let parser = new DOMParser(),
        callInformation = parser.parseFromString(call.content, 'text/xml'),
        callIdentifier = callInformation.getElementsByTagName('partlist')[0]

    if (!callIdentifier.attributes['type'] || !callIdentifier.attributes['callId']) {
        return
    }

    // Create the information object and assign values
    let CallInformationObject = {}
    if (callInformation.getElementsByTagName('duration').length !== 0) {
        CallInformationObject.duration = callInformation.getElementsByTagName('duration')[0].innerHTML
    }

    CallInformationObject.callId = callIdentifier.attributes['callId'].value
    CallInformationObject.whoStartedCall = call.displayName
    CallInformationObject.callDate = new Date(call.originalarrivaltime)
    CallInformationObject.callType = callIdentifier.attributes['type'].value

    //Create the call particepents from the call information xml document
    callParticipents = getCallParticipents(callInformation.getElementsByTagName('name'))
    CallInformationObject.participentOne = callParticipents[0]
    CallInformationObject.participentTwo = callParticipents[1]

    if (!CallInformationObject.whoStartedCall) {
        CallInformationObject.whoStartedCall = CallInformationObject.participentOne
    }

    return CallInformationObject
}

/**
 *
 * @param {Array} callGuests
 * @returns array of the two guests in the call
 */
function getCallParticipents(callGuests) {
    let callParticipents = [
        callGuests[0].innerHTML,
        callGuests[1].innerHTML,
    ]

    return callParticipents
}
