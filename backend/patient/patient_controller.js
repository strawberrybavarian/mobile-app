const Patient = require('./patient_model');
const Doctor = require('../doctor/doctor_model');
const Appointment = require('../appointments/appointment_model');
const MedicalSecretary = require('../medicalsecretary/medicalsecretary_model');
const Prescription = require('../prescription/prescription_model');
const mongoose = require('mongoose');

const NewPatientSignUp = (req, res) => {
    Patient.create(req.body)
    .then((newPatient) => {
        res.json({newPatient: newPatient, status:"Successfully registered Patient."})
        console.log(newPatient)
    })
    .catch((err) => {
        res.json({ message: 'Something went wrong. Please try again.', error:err})
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

//getPatient
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
  Patient.findOne({email:req.params.email})
      .then((thePatient) => {
          res.json({theEmail : thePatient})
      })
      .catch((err) => {
          res.json({ message: 'Something went wrong', error: err })
      });
}

// Array New Post
const addNewPostById = (req, res) => {
    Patient.findById({_id:req.params.id})
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
  

//find posts by id Array 
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

//Deleting by Id Array Post
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
//appts

const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason, cancelReason,secretaryId, prescriptionId  } = req.body;
    const patientId = req.params.uid; // Patient ID from URL parameter

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

    // Update Doctor's appointments
    await Doctor.findByIdAndUpdate(doctorId, {
      $push: { dr_appointments: newAppointment._id }
    });

    // Update Patient's appointments
    await Patient.findByIdAndUpdate(patientId, {
      $push: { patient_appointments: newAppointment._id } // Ensure this field matches the model
    });

    // Update Medical Secretary's appointments 
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
    const appointmentId = req.params.uid; // Appointment ID from URL parameter

    // Find the appointment and update its cancelReason
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: { cancelReason: cancelReason, status: 'Cancelled' } }, // Update cancelReason and status
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

const findAllAppointmentsForPatient = (req, res) => {
    const patientId = req.params.uid;
  
    Patient.findById(patientId)
      .populate({
        path: 'patient_appointments',
        populate: [
          { path: 'doctor', model: 'Doctor' },
          { path: 'prescription', model: 'Prescription' },
          { path: 'secretary', model: 'MedicalSecretary' }
        ]
      })
      .then((patient) => {
        if (!patient) {
          return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({ appointments: patient.patient_appointments });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Something went wrong', error: err });
      });
  };

  const findAppointmentByIdForPatient = (req, res) => {
    const { uid, id } = req.params;
    console.log(`Received UID: ${uid}, AppointmentID: ${id}`);

    Patient.findById(uid)
      .populate({
        path: 'patient_appointments',
        populate: [
          { path: 'doctor', model: 'Doctor' },
          { path: 'prescription', model: 'Prescription' },
          { path: 'secretary', model: 'MedicalSecretary' }
        ]
      })
      .then((patient) => {
        if (!patient) {
          console.log('Patient not found');
          return res.status(404).json({ message: 'Patient not found' });
        }
        console.log('Patient found:', patient);

        // Finding the specific appointment in the populated array
        const appointment = patient.patient_appointments.find(appt => appt._id.toString() === id);

        if (!appointment) {
          console.log('Appointment not found');
          return res.status(404).json({ message: 'Appointment not found' });
        }

        console.log('Appointment found:', appointment);
        res.json({ appointment });
      })
      .catch((err) => {
        console.error('Error in findAppointmentByIdForPatient:', err);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
      });
};

const updateAppointmentForPatient = async (req, res) => {
  try {
    const { uid, id } = req.params;
    const updateData = req.body;

    // Convert the IDs to ObjectId
    const patientId = new mongoose.Types.ObjectId(uid);
    const appointmentId = new mongoose.Types.ObjectId(id);

    // Update the specific appointment within the patient document
    const updatedPatient = await Patient.findOneAndUpdate(
      { _id: patientId, "patient_appointments._id": appointmentId },
      { $set: { "patient_appointments.$[elem]": updateData } },
      {
        arrayFilters: [{ "elem._id": appointmentId }],
        new: true, // Return the updated document
        runValidators: true // Apply schema validation
      }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient or appointment not found' });
    }

    // Find the updated appointment
    const updatedAppointment = updatedPatient.patient_appointments.id(appointmentId);

    res.status(200).json({ appointment: updatedAppointment });
  } catch (error) {
    console.error(error); // Log the error
    res.status(400).json({ message: error.message }); // Send a detailed error message
  }
};

const updateAppointmentStatus = async (req, res) => {
  const { uid, id } = req.params; // `uid` is the patient ID, `id` is the appointment ID
  const { status } = req.body; // Retrieve status from the request body

  console.log('UID:', uid);
  console.log('Appointment ID:', id);
  console.log('Status:', status); // This should not be undefined

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    // Update the status of the specific appointment
    const updatedPatient = await Patient.findOneAndUpdate(
      { _id: uid, 'patient_appointments._id': id },
      { $set: { 'patient_appointments.$.status': status } },
      { new: true, runValidators: true } // Return the updated document and validate
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient or appointment not found' });
    }

    // Retrieve the updated appointment
    const updatedAppointment = updatedPatient.patient_appointments.id(id);

    res.status(200).json({ appointment: updatedAppointment });
  } catch (err) {
    console.log('Error:', err); // Log the error for better debugging
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};


//get all emails
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

// update all details

const updatePatientDetails = (req, res) => {
  const updateData = {
    patient_firstName: req.body.patient_firstName,
    patient_lastName: req.body.patient_lastName,
    patient_middleInitial: req.body.patient_middleInitial,
    patient_contactNumber: req.body.patient_contactNumber,
    patient_dob: req.body.patient_dob,
    patient_email: req.body.patient_email,
    patient_password: req.body.patient_password,
  };
  Patient.findByIdAndUpdate({ _id: req.params.uid }, updateData, { new: true, runValidators: true })
    .then((updatedPatient) => {
      res.json({ updatedPatient: updatedPatient, message: "Successfully updated the Patient" });
    })
    .catch((err) => {
      res.json({ message: 'Something went wrong', error: err });
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
    findAllAppointmentsForPatient,
    findAppointmentByIdForPatient,
    updateAppointmentForPatient,
    updatePatientDetails,
    updateAppointmentStatus
}