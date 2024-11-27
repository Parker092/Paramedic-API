const Medication = require('../models/medicationModel');

// Obtener todas las medicaciones del usuario autenticado
exports.getMedications = async (req, res) => {
    try {
        const medications = await Medication.find({ dui: req.user.dui });

        // Convertir el array de medicamentos a un objeto
        const medicationsObject = {};
        medications.forEach((medication, index) => {
            medicationsObject[`medicamento${index + 1}`] = medication;
        });

        res.status(200).json({ medicamentos: medicationsObject });
    } catch (error) {
        console.error('Error al obtener las medicaciones:', error);
        res.status(500).json({ message: 'Error al obtener las medicaciones' });
    }
};

// Añadir una nueva medicación
exports.addMedication = async (req, res) => {
    try {
        const { name, dosage, frequency, startDate, endDate } = req.body;
        const medication = new Medication({
            dui: req.user.dui,
            name,
            dosage,
            frequency,
            startDate,
            endDate,
        });

        await medication.save();
        res.status(201).json({ message: 'Medicación creada exitosamente', medication });
    } catch (error) {
        console.error('Error al crear la medicación:', error);
        res.status(500).json({ message: 'Error al crear la medicación' });
    }
};

// Actualizar una medicación existente
exports.updateMedication = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, dosage, frequency, startDate, endDate } = req.body;

        const medication = await Medication.findOneAndUpdate(
            { _id: id, dui: req.user.dui },
            { name, dosage, frequency, startDate, endDate },
            { new: true, runValidators: true }
        );

        if (!medication) {
            return res.status(404).json({ message: 'Medicación no encontrada' });
        }

        res.status(200).json({ message: 'Medicación actualizada exitosamente', medication });
    } catch (error) {
        console.error('Error al actualizar la medicación:', error);
        res.status(500).json({ message: 'Error al actualizar la medicación' });
    }
};

// Eliminar una medicación existente
exports.deleteMedication = async (req, res) => {
    try {
        const { id } = req.params;
        const medication = await Medication.findOneAndDelete({ _id: id, dui: req.user.dui });

        if (!medication) {
            return res.status(404).json({ message: 'Medicación no encontrada' });
        }

        res.status(200).json({ message: 'Medicación eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la medicación:', error);
        res.status(500).json({ message: 'Error al eliminar la medicación' });
    }
};
