let skypeConversation;
window.addEventListener('load', function () {
    document.getElementById('tar-upload-input').addEventListener('change',function (e) {

        let reader = new FileReader();
        reader.onload = function(event) {
            let skypeJsonObject = JSON.parse(event.target.result),
                skypePrimaryUser = skypeJsonObject.userId
                skypeConversation = skypeJsonObject.conversations

            const callEvents = getAllCallEvents(skypeConversation)
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
 * Splits the json into call events and messages
 * @param {Array} conversations
 */
function splitCalls(conversations) {
    conversations.forEach(conversation => {
        conversation.MessageList.forEach(message => {
            if (message.messagetype === 'Event/Call') {
                const xmlStr = message.content,
                    parser = new DOMParser(),
                    doc = parser.parseFromString(xmlStr, "application/xml"),
                    errorNode = doc.querySelector("parseerror")

                    //console.log(xmlStr)

                    if (errorNode) {
                        console.log("error while parsing")
                    } else {
                        //console.log(doc.documentElement)
                    }
            }
        })
    })
}
