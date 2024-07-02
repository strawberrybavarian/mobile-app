const Patient = require('./patient_model');
const Doctor = require('../doctor/doctor_model');
const Appointment = require('../appointments/appointment_model');
const MedicalSecretary = require('../medicalsecretary/medicalsecretary_model');
const Rx = require('./rx_model');

const NewRx = (req, res) => {
    Rx.create(req.body)
    .then((newRx) => {
        res.json({newRx: newRx, status:"Successfully created prescription."})
        console.log(newRx)
    })
    .catch((err) => {
        res.json({ message: 'Something went wrong. Please try again.', error:err})
        console.log(err)
    });
}

const findAllRx = (req, res) => {
    Patient.findById(req.params.id)
    .then((Patient))
}



module.exports = {
    
}