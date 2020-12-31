/* eslint-disable no-console */
const XLSX = require('xlsx')

export function convertToXlsx (document, json) {

    var ws = XLSX.utils.json_to_sheet(json)
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Records");
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

export function convertRecordXlsx (document, recordArray) {

  var ws = XLSX.utils.json_to_sheet(recordArray)
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Records");
  
  var ws_diagnosis = XLSX.utils.json_to_sheet(this.extractSubarray(recordArray, 'diagnosis') || []) 
  XLSX.utils.book_append_sheet(wb, ws_diagnosis, "Diagnosis");
  var ws_imaging = XLSX.utils.json_to_sheet(this.extractSubarray(recordArray, 'imaging') || [])
  XLSX.utils.book_append_sheet(wb, ws_imaging, "Imaging");
  var ws_medication = XLSX.utils.json_to_sheet(this.extractSubarray(recordArray, 'medication') || [])
  XLSX.utils.book_append_sheet(wb, ws_medication, "Medications");
  var ws_device = XLSX.utils.json_to_sheet(this.extractSubarray(recordArray, 'device') || [])
  XLSX.utils.book_append_sheet(wb, ws_device, "Devices");
  var ws_event = XLSX.utils.json_to_sheet(this.extractSubarray(recordArray, 'event') || [])
  XLSX.utils.book_append_sheet(wb, ws_event, "Events");
  
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

export function extractSubarray (array, prop) {
  const result = array.reduce((results, item) => [...results, ...item[prop]], []);
  return result
}