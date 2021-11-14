function exportTableToPdf(table) {
    let skypeExport = document.getElementById(table).innerHTML

    console.log(skypeExport)
    let newWindow = window.open('','', 'height=700, width=700')

    newWindow.document.write('<html><head>')
    newWindow.document.write('<title>Export Skype</title>')
    newWindow.document.write('</head>')
    newWindow.document.write('<body>')
    newWindow.document.write(skypeExport)
    newWindow.document.write('</body></html>')
    newWindow.document.close()
    newWindow.print()
}

document.getElementById('export-skype-pdf').addEventListener('click', function () {
    exportTableToPdf('skype-table')
})
