const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    dui: { type: String, ref: 'User', required: true },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Medication', medicationSchema);
