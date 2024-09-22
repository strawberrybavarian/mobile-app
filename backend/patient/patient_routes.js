const PatientController = require ('../patient/patient_controller');
// const { validationResult } = require('express-validator');
console.log("Patient routes connected");
module.exports = app => { 
    app.get('/patient/api/test',(req,res)=>{res.json({message:"the api is working"})});
    
    //New Patient Sign Up
    app.post('/patient/api/signup', PatientController.NewPatientSignUp);

    //Patient Log In
    app.get('/patient/api/allpatient', PatientController.findAllPatient);

    //Update Patient Information
    
    app.put('/patient/api/:uid/updatedetails', PatientController.updatePatientDetails);

    //Finding One Patient
    app.get('/patient/api/onepatient/:uid', PatientController.findPatientById)
    app.get('/patient/api/allemail', PatientController.getAllPatientEmails)

    //Create Appointment
    app.post('/patient/api/:uid/createappointment', PatientController.createAppointment);
    app.put('/patient/api/:uid/updateappointment', PatientController.cancelAppointment)
    app.put('/patient/api/:uid/updateapptstatus/:id', PatientController.updateAppointmentStatus)

    app.get('/patient/api/:uid/allappt', PatientController.findAllAppointmentsForPatient)
    app.get('/patient/api/:uid/oneappt/:id', PatientController.findAppointmentByIdForPatient)
    app.put('/patient/api/:uid/updateappt/:id', PatientController.updateAppointmentForPatient)



}
