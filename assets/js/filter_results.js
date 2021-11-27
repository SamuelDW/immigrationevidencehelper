let nameBeingChangedInput = document.querySelector('#name-being-changed-select'),
    table = document.querySelector('#skype-table'),
    removeSelectBox = document.querySelector('#select-remove'),
    nameReplacingInput = document.querySelector('#name-desired-input')
    replaceButton = document.querySelector('#replace-button'),
    yearSelector = document.querySelector('#year-selector'),
    resetTableButton = document.querySelector('#reset-table'),
    originalContacts = [],
    newContacts = [],
    changingContacts = [],
    selectBoxesContacts = [nameBeingChangedInput, removeSelectBox],

removeSelectBox.addEventListener('change', function () {
    removeCallsByPerson(table, removeSelectBox.value, 3)
})

replaceButton.addEventListener('click', function () {
    newContacts.push(nameReplacingInput.value)
    originalContacts.push(nameBeingChangedInput.value)

    let changedContact = {
        originalName: nameBeingChangedInput.value,
        newName: nameReplacingInput.value
    }

    changingContacts = addToChangedContacts(changedContact, changingContacts)
    originalContacts = removeDuplicates(originalContacts)
    newContacts = removeDuplicates(newContacts)

    changeNamesInTable(table, nameBeingChangedInput, nameReplacingInput)
    updateSelectBoxes(nameReplacingInput.value, originalContacts, selectBoxesContacts)
})

yearSelector.addEventListener('keydown', function () {
    showRowsBySpecificYear(table, yearSelector.value)
})

resetTableButton.addEventListener('click', function () {
    resetTable(table)
    resetSelectBoxes(selectBoxesContacts, 'contacts-hidden')
    resetTableNames(changingContacts, table)
})

/**
 * Adds contact to array for use in resetting
 * @param {Object} changedObject
 * @param {Array<Object>} changedArray
 * @returns
 */
function addToChangedContacts(changedObject, changedArray) {
    if(changedArray.length === 0) {
        changedArray.push(changedObject)

        return changedArray
    }
    changedArray.forEach(changed => {
        if (changed.originalName === changedObject.originalName) {
            changed.newName = changedObject.newName
        } else {
            changedArray.push(changed)
        }
    })
    return changedArray
}

/**
 * For removing duplicates in the contact list
 * @param {Array} data
 * @returns
 */
function removeDuplicates(data) {
    return [...new Set(data)]
}

/**
 * Remove call rows by person contained
 * @param {Element} table table that needs editing
 * @param {*} selectedOption selectbox value to look for
 * @param {Numer} tableColumn table column to look under
 */
function removeCallsByPerson(table, selectedOption, tableColumn) {
    let tableRows = table.rows

    for (let i = tableRows.length; i > 0; i--) {
        if (tableRows[i -1].cells[tableColumn].innerHTML === selectedOption) {
            tableRows[i-1].classList.add('hidden')
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
 * Removes the rows that are from the same year
 * @param {Element} table
 * @param {Number} year
 */
function showRowsBySpecificYear(table, year) {
    for (let i = table.rows.length; i > 0; i--) {
        let date = table.rows[i -1].cells[0].innerHTML
        if (date.split("/")[2] === year) {
            table.rows[i-1].classList.add('hidden')
        }
    }
}

/**
 * Updates the select boxes with the new elements
 * @param {Array<String>} newArray strings of new option values
 * @param {Array<Element>} arraySelectBoxElements array of select box elements to update
 */
function updateSelectBoxes(newValue, originalArray, arraySelectBoxElements) {
    arraySelectBoxElements.forEach(selectBox => {
        for (let i =0; i < selectBox.length; i++) {
            if (originalArray.includes(selectBox[i].value)) {
                //selectBox[i].value = newValue
                selectBox[i].text = newValue
            }
        }
    })
}

/**
 * Resets selectBoxes from hidden div with value of arrays
 * @param {Array<Element>} arraySelectBoxElements array of select boxes to update
 * @param {String} hiddenField div id that contains the array to populate from
 */
function resetSelectBoxes(arraySelectBoxElements, hiddenField) {
    let originalContacts = document.getElementById(hiddenField).value
    arraySelectBoxElements.forEach(selectBox => {
        selectBox.options.length = 1;
        originalContacts.forEach(contact => {
            let row = document.createElement('option')
                row.value = contact
                row.text = contact
            selectBox.appendChild(row)
        })
    })
}

/**
 * Remove all the hidden rows
 * @param {Element} table table that needs clearing of hidden values
 */
function resetTable (table) {
    let tablebody = table.lastElementChild

    for (let i = 0; i < tablebody.rows.length; i++) {
        if (tablebody.rows[i].classList.contains('hidden')) {
            tablebody.rows[i].classList.remove('hidden')
        }
    }
}

/**
 * Reset all names in the table to the original value
 * @param {Array<Object>} changedContacts names that need changing
 * @param {Element} table table that needs resetting
 */
function resetTableNames(changedContacts, table) {
    for (let i = 0; i < table.rows.length; i++) {
        let participents = table.rows[i].cells[2].childNodes,
            CallStartedByCell = table.rows[i].cells[3],
            participentOne = participents[0],
            participentTwo = participents[1]

        changedContacts.forEach(changed => {
            if (CallStartedByCell.innerHTML === changed.newName) {
                CallStartedByCell.innerHTML = changed.originalName
            }
            if (participentOne.innerHTML === changed.newName) {
                participentOne.innerHTML = changed.originalName
            }
            if (participentTwo.innerHTML === changed.newName) {
                participentTwo.innerHTML = changed.originalName
            }
        })
    }
}
