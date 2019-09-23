import {format} from 'date-fns'
function patientDataPreProcess (target, source) {
   if (!target.dob && source.dob) {
     target.dob = source.dob
   }
   if (source.Death) {
     target.deceasedDate = excelDateToJS(source.DateDeath)
   }
   //diagnosis
   let sourceDiagnosis = {
                      diagnosisName: 'Breast Cancer', dateStart: excelDateToJS(source.DateDxCA),
                      treatingPhysician: 'Tzemos',

                      details: {
                          extent: source.LocalizedCa?"Localized":"Metastatic", recurrence: !!source.Recurrence,
                          hypertension: source.HTN?true:false,
                          DM: source.DM?true:false,
                          HxMiscMedPriorCond: source.HxMiscMedPriorCond?true:false,
                          CVhx: source['CV History']?true:false,
                          CVsx: source['CV Sx']?true:false
                      }
                    }
   let targetDiagnosis = target.diagnosis.find(d=> d.diagnosisName == 'Breast Cancer') || {}
   targetDiagnosis = Object.assign(targetDiagnosis, sourceDiagnosis)

   target.diagnosis = [targetDiagnosis]

   console.log(JSON.stringify(target))
   return target
}

function excelDateToJS(excelDate) {

  // JavaScript dates can be constructed by passing milliseconds
  // since the Unix epoch (January 1, 1970) example: new Date(12312512312);

  // 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1 (Google "excel leap year bug")             
  // 2. Convert to milliseconds.

	return format(new Date((excelDate - (25567 + 1))*86400*1000), 'YYYY-MM-DD')

}
   

 export {patientDataPreProcess}