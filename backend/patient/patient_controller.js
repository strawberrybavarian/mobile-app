const Patient = require('./patient_model');
const Doctor = require('../doctor/doctor_model');
const Appointment = require('../appointments/appointment_model');
const MedicalSecretary = require('../medicalsecretary/medicalsecretary_model');
const Prescription = require('../prescription/prescription_model')

const NewPatientSignUp = (req, res) => {
    Patient.create(req.body)
    .then((newPatient) => {
        res.json({ newPatient: newPatient, status:"Successfully registered Patient." })
        console.log(newPatient)
    })
    .catch((err) => {
        res.json({ message: 'Something went wrong. Please try again.', error: err })
        console.log(err)
    });
} 

const findAllPatient = (req, res) => {
    Patient.find()
    .then((allDataPatient) => {
        res.json({ thePatient: allDataPatient })
    })
    .catch((err) => {
        res.json({ message: 'Something went wrong', error: err })
    });
}

const findPatientById = (req, res) => {
    Patient.findOne({ _id: req.params.uid })
    .populate({
        path: 'patient_appointments',
        populate: [
            {
                path: 'doctor',
                model: 'Doctor'
            },
            {
                path: 'prescription',
                model: 'Prescription',
                populate: {
                    path: 'doctor',
                    model: 'Doctor'
                }
            }
        ]
    })
    .then((thePatient) => {
        if (!thePatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({ thePatient });
    })
    .catch((err) => {
        console.error('Error finding patient by ID:', err);
        res.status(500).json({ message: 'Something went wrong', error: err });
    });
};

const findPatientByEmail = (req, res) => {
    Patient.findOne({ email: req.params.email })
    .then((thePatient) => {
        res.json({ theEmail: thePatient })
    })
    .catch((err) => {
        res.json({ message: 'Something went wrong', error: err })
    });
}

const addNewPostById = (req, res) => {
    Patient.findById({ _id: req.params.id })
    .then((Patient) => {
        if (!Patient) {
            res.json({ message: 'Patient not found' });
        }
        Patient.post.unshift(req.body.post);
        return Patient.save();
    })
    .then((updatedPatient) => {
        res.json({ updatedPatient, message: 'New post added successfully' });
    })
    .catch((error) => {
        res.json({ message: 'Error adding post', error });
    });
};

const getAllPostbyId = (req, res) => {
    Patient.findOne({ _id: req.params.id })
    .then((Patient) => {
        if (!Patient) {
            res.json({ message: 'Patient not found' });
        }
        res.json({ posts: Patient.post }); 
    })
    .catch((err) => {
        res.json({ message: 'Error retrieving posts', error: err });
    });
};

const findPostByIdDelete = (req, res) => {
    Patient.findById(req.params.uid)
    .then((Patient) => {
        if (!Patient) {
            return res.json({ message: 'Patient not found' });
        }
        Patient.post.splice(req.params.index, 1); 
        return Patient.save()
        .then((updatedPatient) => {
            res.json({ updatedPatient, message: 'Post deleted successfully' });
        })
        .catch((error) => {
            res.json({ message: 'Error deleting post', error });
        });
    })
    .catch((error) => {
        res.json({ message: 'Error finding Patient', error });
    });
};

const updatePostAtIndex = (req, res) => {
    Patient.findById(req.params.id)
    .then((Patient) => {
        if (!Patient) {
            return res.json({ message: 'Patient not found' });
        }
        Patient.post[req.params.index] = req.body.post; 
        return Patient.save()
        .then((updatedPatient) => {
            res.json({ updatedPatient, message: 'Post updated successfully' });
        })
        .catch((error) => {
            res.json({ message: 'Error updating post', error });
        });
    })
    .catch((error) => {
        res.json({ message: 'Error finding Patient', error });
    });
};

const createAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, reason, cancelReason, secretaryId, prescriptionId } = req.body;
        const patientId = req.params.uid;

        const newAppointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            prescription: prescriptionId,
            date,
            time,
            reason,
            cancelReason,
            secretary: secretaryId
        });

        await newAppointment.save();

        await Doctor.findByIdAndUpdate(doctorId, {
            $push: { dr_appointments: newAppointment._id }
        });

        await Patient.findByIdAndUpdate(patientId, {
            $push: { patient_appointments: newAppointment._id }
        });

        if (secretaryId) {
            await MedicalSecretary.findByIdAndUpdate(secretaryId, {
                $push: { ms_appointments: newAppointment._id }
            });
        }

        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const { cancelReason } = req.body;
        const appointmentId = req.params.uid;

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { $set: { cancelReason: cancelReason, status: 'Cancelled' } },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllPatientEmails = (req, res) => {
    Patient.find({}, 'patient_email')
    .then((patients) => {
        const emails = patients.map(patient => patient.patient_email);
        res.json(emails);
    })
    .catch((err) => {
        res.json({ message: 'Something went wrong', error: err });
    });
};

const findAllAppointments = (req, res) => {
    Appointment.find()
    .populate('patient')
    .populate('doctor')
    .populate('secretary')
    .populate('prescription')
    .then((appointments) => {
        res.status(200).json(appointments);
    })
    .catch((error) => {
        res.status(500).json({ message: error.message });
    });
};

const findAppointmentById = (req, res) => {
    const { id } = req.params;
    Appointment.findById(id)
    .populate('patient')
    .populate('doctor')
    .populate('secretary')
    .populate('prescription')
    .then((appointment) => {
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    })
    .catch((error) => {
        res.status(500).json({ message: error.message });
    });
};

const updateAppointment = (req, res) => {
    const { id } = req.params;
    Appointment.findByIdAndUpdate(id, req.body, { new: true })
    .populate('patient')
    .populate('doctor')
    .populate('secretary')
    .populate('prescription')
    .then((updatedAppointment) => {
        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json(updatedAppointment);
    })
    .catch((error) => {
        res.status(500).json({ message: error.message });
    });
};

module.exports = {
    NewPatientSignUp,
    findAllPatient,
    findPatientByEmail,
    addNewPostById,
    getAllPostbyId,
    findPostByIdDelete,
    findPatientById,
    updatePostAtIndex,
    createAppointment,
    cancelAppointment,
    getAllPatientEmails,
    findAllAppointments,
    findAppointmentById,
    updateAppointment
};
