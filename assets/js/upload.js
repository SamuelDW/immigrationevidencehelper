/**
 * Declaring Objects
 */
let callInfo = {
    whoStartedCall: false,
    participentOne: false,
    participentTwo: false,
    duration: false,
    timeStarted: false,
    timeEnded: false,
    callId: false,
    callDate: false,
    callType: false,
}
//DURATION IS IN SECONDS

window.addEventListener('load', function () {
    document.getElementById('tar-upload-input').addEventListener('change',function (e) {

        let reader = new FileReader();
        reader.onload = function(event) {
            let skypeJsonObject = JSON.parse(event.target.result),
                skypeConversation = skypeJsonObject.conversations

            // Get all the events that are calls, discard the rest
            // And then create the information from this object
            console.time('test')
            const callEvents = getAllCallEvents(skypeConversation)
            let callInformationArray = []
            callEvents.forEach(call => {
                let callObject = createCallInformationObject(call, callInfo)
                if (callObject) {
                    console.log(callObject)
                    callInformationArray.push(callObject)
                }
            })
            console.log(callInformationArray)
            console.timeEnd('test')
        }
        reader.readAsText(e.target.files[0]);
    })
})

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
 * @param {Object} CallInformationObject
 * @returns CallInformationObject with filled data
 */
function createCallInformationObject(call, CallInformationObject) {
    let parser = new DOMParser(),
        callInformation = parser.parseFromString(call.content, 'text/xml'),
        callParticipents = callInformation.getElementsByTagName('name'),
        callIdentifier = callInformation.getElementsByTagName('partlist')[0],
        callType = callIdentifier.attributes['type'],
        callDate = new Date(call.originalarrivaltime),
        callEventId = callIdentifier.attributes['callId'],
        callDurationArray = callInformation.getElementsByTagName('duration'),
        callDuration = null

    if (!callType) {
        return
    }
    if (!callEventId) {
        return
    }
    if (callDurationArray.length !== 0) {
        callDuration = callDurationArray[0].innerHTML
    }

    CallInformationObject.callType = callType.value
    CallInformationObject.callId = callEventId.value
    CallInformationObject.whoStartedCall = call.displayName
    CallInformationObject.callDate = callDate
    CallInformationObject.callType = callType.value
    CallInformationObject.duration = callDuration

    callParticipents = getCallParticipents(callParticipents)
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
