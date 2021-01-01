/* eslint-disable no-console */
const XLSX = require('xlsx')

export function convertToXlsx(document, json) {
  const ws = XLSX.utils.json_to_sheet(json)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Records')
  const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
  const link = document.createElement('a')
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
  })

  // let blob = new Blob([ws], { type: 'application/octet-stream' })
  link.href = window.URL.createObjectURL(blob)
  link.download = 'file.xlsx'
  link.click()
}

export function convertRecordXlsx(document, recordArray) {
  const ws_diagnosis = XLSX.utils.json_to_sheet(
    extractSubarray(recordArray, 'diagnosis') || []
  )
  const ws_imaging = XLSX.utils.json_to_sheet(
    extractSubarray(recordArray, 'imaging') || []
  )
  const ws_medication = XLSX.utils.json_to_sheet(
    extractSubarray(recordArray, 'medication') || []
  )
  const ws_device = XLSX.utils.json_to_sheet(
    extractSubarray(recordArray, 'device') || []
  )
  const ws_event = XLSX.utils.json_to_sheet(
    extractSubarray(recordArray, 'event') || []
  )
  const ws_other = XLSX.utils.json_to_sheet(
    extractSubarray(recordArray, 'other') || []
  )

  recordArray.forEach((r) => {
    delete r.diagnosis
    delete r.imaging
    delete r.medication
    delete r.device
    delete r.event
    delete r.other
  })
  const ws = XLSX.utils.json_to_sheet(recordArray)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Records')

  XLSX.utils.book_append_sheet(wb, ws_diagnosis, 'Diagnosis')
  XLSX.utils.book_append_sheet(wb, ws_imaging, 'Imaging')
  XLSX.utils.book_append_sheet(wb, ws_medication, 'Medications')
  XLSX.utils.book_append_sheet(wb, ws_device, 'Devices')
  XLSX.utils.book_append_sheet(wb, ws_event, 'Events')
  XLSX.utils.book_append_sheet(wb, ws_other, 'Other')

  const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
  const link = document.createElement('a')
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
  })

  // let blob = new Blob([ws], { type: 'application/octet-stream' })
  link.href = window.URL.createObjectURL(blob)
  link.download = 'file.xlsx'
  link.click()
}

function extractSubarray(array, prop) {
  let result = array.reduce((results, item) => [...results, ...item[prop]], [])
  result = result.map((r) => flattenObject(r))
  return result
}

function flattenObject(ob) {
  const toReturn = {}

  for (const i in ob) {
    if (!ob.hasOwnProperty(i)) continue

    if (typeof ob[i] === 'object' && ob[i] !== null) {
      const flatObject = flattenObject(ob[i])
      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue

        toReturn[`${i}.${x}`] = flatObject[x]
      }
    } else {
      toReturn[i] = ob[i]
    }
  }
  return toReturn
}
