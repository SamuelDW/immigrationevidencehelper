let nameBeingChangedInput = document.getElementById('name-being-changed-select'),
    table = document.getElementById('skype-table'),
    removeSelectBox = document.getElementById('select-remove'),
    nameReplacingInput = document.getElementById('name-desired-input')
    replaceButton = document.getElementById('replace-button'),
    yearSelector = document.getElementById('year-selector')

/**
 * On change, remove the rows in the table
 */
removeSelectBox.addEventListener('change', function () {
    removeCallsByPerson(table, removeSelectBox.value)
})

/**
 * On button press, replace names in the table
 */
replaceButton.addEventListener('click', function () {
    changeNamesInTable(table, nameBeingChangedInput, nameReplacingInput)
})

yearSelector.addEventListener('keydown', function () {
    showRowsBySpecificYear(table, yearSelector.value)
})

/**
 * Remove call rows by person contained
 * @param {Element} table
 * @param {*} selectedOption
 */
function removeCallsByPerson(table, selectedOption) {
    let tableRows = table.rows

    for (let i = tableRows.length; i > 0; i--) {
        if (tableRows[i -1].cells[3].innerHTML === selectedOption) {
            table.deleteRow(i -1)
        }
    }
}

/**
 * Change names in a table in columns
 * @param {Element} table table to be affected
 * @param {Element} valueEnteredInput selected name to change
 * @param {Element} nameBeingChangedValue name being changed to this value
 */
function changeNamesInTable(table, valueEnteredInput, nameBeingChangedValue) {
    let nameToChange = valueEnteredInput.value,
        newName = nameBeingChangedValue.value

    for (let i = 0; i < table.rows.length; i++) {
        let participents = table.rows[i].cells[2].childNodes,
            startedBy = table.rows[i].cells[3]

        participents[0].innerHTML = (participents[0].innerHTML === nameToChange)
            ? participents[0].innerHTML = newName
            : participents[0].innerHTML

        participents[1].innerHTML = (participents[1].innerHTML === nameToChange)
            ? participents[1].innerHTML = newName
            : participents[1].innerHTML

        startedBy.innerHTML = (startedBy.innerHTML === nameToChange)
            ? startedBy = newName
            : startedBy.innerHTML
    }
}

/**
 *
 * @param {Element} table
 * @param {Number} year
 */
function showRowsBySpecificYear(table, year) {
    for (let i = table.rows.length; i > 0; i--) {
        let date = table.rows[i -1].cells[0].innerHTML
        if (date.split("/")[2] === year) {
            table.deleteRow(i -1)
        }
    }
}
