import {format} from 'date-fns'

function patientPreProcess(source, registry) {
  //screen empties
  if (!source) return null
  if (!source.ptName) return null
  let target = {}
  target.registry = registry

  if (source.mrn) {
    target.mrn = source.mrn
  } else {
    return {success: false, output: `(MRN: ${source.mrn}) ${source.ptName} (DOB: ${source.dob})  - MRN MISSING`}
  }

  if (source.studyId) {
    target.studyId = source.studyId
  } else {
    return {success: false, output: `(MRN: ${source.mrn}) ${source.ptName} (DOB: ${source.dob})  - studyId MISSING`}
  }

  //screen date of birth
  if (typeof source.dob == 'number') {//convert from excel date to javascript
    target.dob = excelDateToJS(source.dob)
  } else {
    target.dob = source.dob
  }

  //parse name
  let nameLastFirst = source.ptName.trim().split(',')
  if (nameLastFirst.length != 2) {
    return ({result: "ERROR", success: false,
                                output: `(MRN: ${source.mrn}) ${source.ptName} (DOB: ${source.dob})  - UNABLE TO SPLIT NAME INTO TWO`
                                })
  }

  let nameFirstMiddle = nameLastFirst[1].trim().split(' ')
  if (nameFirstMiddle.length >= 2) {
    target.middleName = nameFirstMiddle[nameFirstMiddle.length-1] //last one bercomes middle name
    nameFirstMiddle.pop()
    target.firstName = nameFirstMiddle.join(' ') //all others become first
  } else {
    target.firstName = nameLastFirst[1]
  }
  target.lastName = nameLastFirst[0]
  return target
}






function patientDataPreProcess (target, source) {
   if (!target.dob && source.dob) {
     target.dob = source.dob
   }
   if (source.Death) {
     target.deceasedDate = excelDateToJS(source.DateDeath)
   }
   //diagnosis
   console.log(source)
   let sourceDiagnosis = {
                      diagnosisName: 'Breast Cancer', dateStart: excelDateToJS(source.DateDxCA),
                      treatingPhysician: 'Tzemos',

                      details: {
                          extent: source.LocalizedCa?"Localized":"Metastatic", recurrence: !!source.Recurrence,
                          hypertension: source.HTN?true:false,
                          DM: source.DM?true:false,
                          HxMiscMedPriorCond: source.HxMiscMedPriorCond?true:false,
                          CVhx: source['CV History']?true:false,
                          CVsx: source['CV Sx']?true:false,
                          herceptinStudy: source['HerceptinStudyGroup']?true:false,
                          herceptinStudyDate: excelDateToJS(source['Echo 1'] || source['Echo 1_1'])
                      }
                    }
   let targetDiagnosis = target.diagnosis.find(d=> d.diagnosisName == 'Breast Cancer') || {}
   targetDiagnosis = Object.assign(targetDiagnosis, sourceDiagnosis)

   target.diagnosis = [targetDiagnosis]

   //medications
   
   if (source.ChemoStartDate) {
      if (!target.medication) target.medication = []
      let sourceMedication = {
                          details: {},
                          startDate: excelDateToJS(source.ChemoStartDate),
                          medicationName: 'Chemotherapy'
                        }
      
      if (source.concurrChemo_FEC_D) {
        sourceMedication.details.chemoAgent = 'FEC-D'
        sourceMedication.visibleDetail = sourceMedication.details.chemoAgent
        if (!target.medication.find(m => (m.startDate==sourceMedication.startDate && m.details.chemoAgent == sourceMedication.details.chemoAgent)))
            target.medication.push({...sourceMedication, details: {...sourceMedication.details}})
      }
      if (source.concurChemoTaxel) {
        sourceMedication.details.chemoAgent = 'Taxel'
        sourceMedication.visibleDetail = sourceMedication.details.chemoAgent
        if (!target.medication.find(m => (m.startDate==sourceMedication.startDate && m.details.chemoAgent == sourceMedication.details.chemoAgent)))
            target.medication.push({...sourceMedication, details: {...sourceMedication.details}})
      }      
      if (source.concurChemoCyclo) {
        sourceMedication.details.chemoAgent = 'Cyclosporin'
        sourceMedication.visibleDetail = sourceMedication.details.chemoAgent
        if (!target.medication.find(m => (m.startDate==sourceMedication.startDate && m.details.chemoAgent == sourceMedication.details.chemoAgent)))
            target.medication.push({...sourceMedication, details: {...sourceMedication.details}})
      }
      if (source.ConcurChemoOther) {
        sourceMedication.details.chemoAgent = 'Other'
        sourceMedication.visibleDetail = sourceMedication.details.chemoAgent
        if (!target.medication.find(m => (m.startDate==sourceMedication.startDate && m.details.chemoAgent == sourceMedication.details.chemoAgent)))
            target.medication.push({...sourceMedication, details: {...sourceMedication.details}})
      }
      if (source.ConcurPertuzu) {
        sourceMedication = {
                    startDate: excelDateToJS(source.ChemoStartDate),
                    medicationName: 'Pertuzumab',
                    details: {}
        }
        if (!target.medication.find(m => (m.startDate==sourceMedication.startDate && m.medicationName ==sourceMedication.medicationName)))
            target.medication.push({...sourceMedication})
      }
  }
  // HERCEPTIN------------------------------
  function getStatusHerceptin1(source) { //converts status
    if (source) {
      if (source["CompleteHercep"]) {
        return "Completed"
      } else if (source["HerceptinStopped"]) {
        return "Stopped"
      } else {
        return "Ongoing"
      }
    }
  }
  function getStatusHerceptin2(source) { //converts status
    if (source) {
      if (source["CompleteHercep2"]) {
        return "Completed"
      } else if (source["HerceptinStopped2"]) {
        return "Stopped"
      } else {
        return "Ongoing"
      }
    }
  }
  function medicationExists(target, newMed) {
    return target.medication.find(m => (m.startDate==newMed.startDate && m.medicationName ==newMed.medicationName))
  }

  if (source["Herceptin 1"]) {
    let herceptin1 = {
      medicationName: "Herceptin",
      startDate: excelDateToJS(source["Herceptin 1"]),
      visibleDetail: getStatusHerceptin1(source),
      details: {
        status: getStatusHerceptin1(source),
        cycles: source["No_cycles 1"]
      }
    }
    if (!medicationExists(target, herceptin1))
      target.medication.push(herceptin1)
  }
  if (source["Re_start Herceptin"]) {
    let herceptin2 = {
      medicationName: "Herceptin",
      startDate: excelDateToJS(source["Re_start Herceptin"]),
      visibleDetail: getStatusHerceptin2(source),
      details: {
        status: getStatusHerceptin2(source),
        cycles: source["No_cycles 2"]
      }
    }
    if (!medicationExists(target, herceptin2))
      target.medication.push(herceptin2)
  }

  //BB and ACE i ------------------------------------------------------
  if (source["ARB_ACEi"]) {
    let ace = {
      medicationName: "ACE/ARB",
      details: {}
    }
    if (!source["ARB_ACEpreTx"]) {
      ace.startDate = excelDateToJS(source["A start"])
      ace.details.pretreatment = false
      ace.visibleDetail = "After Herceptin"
    } else {
      ace.details.pretreatment = true
      ace.visibleDetail = "Pre-treatment"
    }
    if (!medicationExists(target, ace)) {
      target.medication.push(ace)
    }
  }
  if (source["BB"]) {
    let bb = {
      medicationName: "B-Blocker",
      details: {}
    }
    if (!source["BBpreTX"]) {
      bb.startDate = excelDateToJS(source["BB Start"])
      bb.details.pretreatment = false
      bb.visibleDetail = "After Herceptin"
    } else {
      bb.details.pretreatment = true
      bb.visibleDetail = "Pre-treatment"
    }
    if (!medicationExists(target, bb)) {
      target.medication.push(bb)
    }
  }



  //target.medication = [] //clear meds
  //target.medication.push(JSON.parse(JSON.stringify(sourceMedication)))

  //imaging
  function imagingExists(target, newImaging) {
    return target.medication.find(m => (m.studyDate==newImaging.studyDate && m.imagingName ==newImaging.imagingName))
  }

  if (source['PreHercepEcho Prestudy']) {
    let newImaging = {
      imagingName: 'Echo',
      preStudy: true,
      studyDate: excelDateToJS(source.PrestudyEcho),
      EF: source['PreStudy LVEF'],
      EFtext: source['PreStudy LVEF'],
      details: {
        LVGLS: source['PreStudy GLS']
      }
    }
    if (!imagingExists(target, newImaging)) {
      target.imaging.push(newImaging)
    }
  }

  

   //console.log(JSON.stringify(target))
   return target
}

function excelDateToJS(excelDate) {

  // JavaScript dates can be constructed by passing milliseconds
  // since the Unix epoch (January 1, 1970) example: new Date(12312512312);

  // 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1 (Google "excel leap year bug")             
  // 2. Convert to milliseconds.
  console.log(excelDate)
  console.log(format(new Date((excelDate - (25567 + 1))*86400*1000), 'YYYY-MM-DD'))
	return format(new Date((excelDate - (25567 + 1))*86400*1000), 'YYYY-MM-DD')

}
   

 export {patientDataPreProcess, patientPreProcess}