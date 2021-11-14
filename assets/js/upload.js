window.addEventListener('load', function () {
    document.getElementById('tar-upload-input').addEventListener('change',function (e) {
        let callInformationArray = [],
            combinedCallsArray = [],
            missedCalls = [],
            reader = new FileReader()

        reader.onload = function(event) {
            let skypeJsonObject = JSON.parse(event.target.result),
                skypeConversation = skypeJsonObject.conversations

            const callEvents = getAllCallEvents(skypeConversation)
            callEvents.forEach(call => {
                let callObject = createCallInformationObject(call)
                if (callObject) {
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

            let distinctCall = {}
            let distinctCalls = combinedCallsArray.filter(function (entry) {
                if(distinctCall[entry.callId]) {
                   return false
                }
                distinctCall[entry.callId] = true
                return true
            })

            displayResultsAsTable(distinctCalls)
        }
        reader.readAsText(e.target.files[0]);
    })
})

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
