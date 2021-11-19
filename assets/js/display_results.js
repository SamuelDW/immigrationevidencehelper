const SKYPE_CALL_DURATION = "skype-call-duration"

function displayResultsAsTable(callArray, table) {
    console.time('test')
    let tableBody = document.getElementById(table).getElementsByTagName('tbody')[0]
    callArray.forEach(call => {
        let row = '<tr><td>' + call.date.toLocaleDateString('en-GB') + '</td>'
            + '<td class="'+ SKYPE_CALL_DURATION +'">' + secondsToHms(call.duration) + '</td>'
            + '<td style="display:inline-grid;">' + '<span>' + call.participentOne + '</span><span>' + call.participentTwo + '</span></td>'
            + '<td>' + call.whoStartedCall + '</td></tr>'

        let newRow = tableBody.insertRow(tableBody.rows.length)
        newRow.innerHTML = row
    })
    document.getElementById('skype-display-table').classList.remove('hidden')
    console.timeEnd('test')
}

function secondsToHms(duration) {
    duration = Number(duration)
    let hours = Math.floor(duration / 3600),
        minutes = Math.floor(duration % 3600 / 60),
        seconds = Math.floor(duration % 3600 % 60)

    let hourDisplay = hours > 0 ? hours + 'h ' : "",
        minuteDisplay = minutes > 0 ? minutes +  'm ' : "",
        secondsDisplay = seconds > 0 ? seconds + 's ' : ""

    return hourDisplay + minuteDisplay + secondsDisplay
}

function populateCallRemoval(contactList, selectBox) {
    let removeBox = document.getElementById(selectBox)
    contactList.forEach(contact => {
        let optionRow = document.createElement('option')
            optionRow.value = contact
            optionRow.innerHTML = contact
        removeBox.appendChild(optionRow)
    })
}

function populateHiddenField(array, fieldId) {
    let hiddenElement = document.getElementById(fieldId)
    hiddenElement.value = array
}
