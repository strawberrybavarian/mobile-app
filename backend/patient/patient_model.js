const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const {Schema, model} = mongoose

const PatientSchema = new Schema ({

    //personal info
    // patient_ID: {
    //     type: String,
    //     unique: true,
    //     required: true
    // },
    patient_firstName: {
        type: String,
        // minlength: 3,
        // maxlength: 20
    },
    patient_middleInitial: {
        type: String,
        // maxlength: 1
    },
    patient_lastName: {
        type: String,
        // minlength: 2,
        // maxlength: 20
    },
    patient_email: {
        type: String,
        unique: true,
        lowercase: true,
        // validate: {
        //     validator: function(v) {
        //         return /\S+@\S+\.\S+/.test(v);
        //     },
        //     message: props => `${props.value} is not a valid email address.`
        // }
    },
    patient_password: {
        type: String,
        minlength: 6,
    },
    patient_dob: {
        type: Date,
    },
    patient_contactNumber: {
        type: String,
    },
    patient_gender: {
        type: String,
    },
    patient_appointments: [{
        type: Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    post: [{
        type: String
    }]
}, { timestamps: true });

//for Patient ID
// PatientSchema.pre('save', async function (next) {
//     if (!this.isNew) {
//       return next();
//     }
  
//     const currentYear = new Date().getFullYear();
  
//     try {
//       const highestPatient = await this.constructor.findOne({
//         patient_ID: new RegExp(`^P${currentYear}-`, 'i') // Match patient_ID starting with current year's format
//       })
//       .sort({ patient_ID: -1 })
//       .limit(1);
  
//       let nextNumber = 1;
//       if (highestPatient) {
//         const lastNumber = parseInt(highestPatient.patient_ID.split('-')[1]);
//         nextNumber = lastNumber + 1;
//       }
  
//       const paddedNumber = nextNumber.toString().padStart(6, '0');
//       this.patient_ID = `P${currentYear}-${paddedNumber}`;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   });


// PatientSchema.method({
//     async authenticate(password) {
//        return bcrypt.compare(password, this.password);
//     },
//   }); 

const Patient = mongoose.model('Patient', PatientSchema);

module.exports = Patient;