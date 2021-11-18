let nameChanger = document.getElementById('name-changer'),
    table = document.getElementById('skype-table'),
    removeSelect = document.getElementById('select-remove')

nameChanger.addEventListener('change', function () {
    let nameToChange = nameChanger.value,
        tableRows = table.rows

    tableRows.forEach(row => {
        let names = row.cells[2].childNodes
        //console.log(row.cells[2].childNodes)
        let participentOne = names[0].innerHTML,
            participentTwo = names[1].innerHTML
    })
})

removeSelect.addEventListener('change', function () {
    removeCallsByPerson(table, removeSelect.value)
})

/**
 * Remove call rows by person contained
 * @param {Element} table
 * @param {*} selectedOption
 */
function removeCallsByPerson(table, selectedOption) {
    let tableRows = table.rows,
        rowsToDelete = [],
        rowCount = tableRows.length

    for (let i = tableRows.length; i > 0; i--) {
        if (tableRows[i -1].cells[3].innerHTML === selectedOption) {
            table.deleteRow(i -1)
        }
    }
}
