/* eslint-disable no-console */
const XLSX = require('xlsx')

module.exports = (document, json)  => {

  var ws = XLSX.utils.json_to_sheet(json)
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "WorksheetName");
  var wbout = XLSX.write(wb, {type:"array", bookType:'xlsx'});
  let link = document.createElement('a')
  var blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'
  })

  //let blob = new Blob([ws], { type: 'application/octet-stream' })
  link.href = window.URL.createObjectURL(blob)
  link.download = 'file.xlsx'
  link.click()
}