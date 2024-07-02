const PatientController = require ('../patient/patient_controller');
// const { validationResult } = require('express-validator');
console.log("Patient routes connected");
module.exports = app => { 
    app.get('/patient/api/test',(req,res)=>{res.json({message:"the api is working"})});
    
    //New Patient Sign Up
    app.post('/patient/api/signup', PatientController.NewPatientSignUp);

    //Patient Log In
    app.get('/patient/api/allpatient', PatientController.findAllPatient);

    //Finding One Patient
    app.get('/patient/api/onepatient/:uid', PatientController.findPatientById)
    //Create Appointment
    app.post('/patient/api/:uid/createappointment', PatientController.createAppointment);
    app.put('/patient/api/:uid/updateappointment', PatientController.cancelAppointment)


}
