const express = require('express');
const { getMedications, addMedication, updateMedication, deleteMedication } = require('../controllers/medicationController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /medication:
 *   get:
 *     summary: Obtener todos los medicamentos del usuario
 *     tags: [Medication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de medicamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 medicamentos:
 *                   type: object
 *                   additionalProperties:
 *                     $ref: '#/components/schemas/Medication'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/', authMiddleware, getMedications);

/**
 * @swagger
 * /medication:
 *   post:
 *     summary: Añadir un nuevo medicamento
 *     tags: [Medication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicationInput'
 *     responses:
 *       201:
 *         description: Medicamento creado exitosamente
 *       400:
 *         description: Solicitud incorrecta
 *       500:
 *         description: Error del servidor
 */
router.post('/', authMiddleware, addMedication);

/**
 * @swagger
 * /medication/{id}:
 *   put:
 *     summary: Actualizar una medicación existente
 *     tags: [Medication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la medicación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicationInput'
 *     responses:
 *       200:
 *         description: Medicación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medication'
 *       404:
 *         description: Medicación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, updateMedication);

/**
 * @swagger
 * /medication/{id}:
 *   delete:
 *     summary: Eliminar una medicación existente
 *     tags: [Medication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la medicación
 *     responses:
 *       200:
 *         description: Medicación eliminada exitosamente
 *       404:
 *         description: Medicación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, deleteMedication);

module.exports = router;
