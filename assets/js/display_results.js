function displayResultsAsTable(callArray, table) {
    let tableBody = document.getElementById(table).getElementsByTagName('tbody')[0]
    callArray.forEach(call => {
        let row = '<tr><td>' + call.date + '</td>'
            + '<td>' + call.duration + '</td>'
            + '<td>' + call.participentOne + ', ' + call.participentTwo + '</td>'
            + '<td>' + call.whoStartedCall + '</td></tr>'

        let newRow = tableBody.insertRow(tableBody.rows.length)
        newRow.innerHTML = row
    })
}
