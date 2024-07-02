const mongoose = require('mongoose');
// const bcrypt = require('bcrypt')
const {Schema, model} = mongoose;

const RxContentSchema = new Schema({
    med_name: {
        type: String,
        required: true
    },
    med_generic: {
        type: String
    },
    med_qty: {
        type: String,
        required: true
    },
    med_remark: {
        type: String,
        required: true
    },

});

const RxSchema = new Schema ({

    rx_doctor:{
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    rx_patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    rx_date: {
        type: Date,
        required: true
    },
    rx_content: {
        type: RxContentSchema,
        required: true
    },

})

const Rx = model('Rx', RxSchema);
module.exports = Rx;