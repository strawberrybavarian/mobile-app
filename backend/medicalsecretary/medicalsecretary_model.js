const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const {Schema, model} = mongoose

const MedicalSecretarySchema = new Schema({
    ms_firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    ms_lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    ms_email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: props => `${props.value} is not a valid email address.`
        }
    },
    ms_password: {
        type: String,
        required: true,
        minlength: 6,
    },
    ms_contactNumber: {
        type: String,
        required: true,
        unique: true,
    },
    ms_appointments: [{
        type: Schema.Types.ObjectId,
        ref: 'Appointment'
    }]
}, { timestamps: true });

const MedicalSecretary = model('MedicalSecretary', MedicalSecretarySchema);
module.exports = MedicalSecretary;
