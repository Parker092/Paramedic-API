const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Paramedic API',
      version: '1.0.0',
      description: 'API para la aplicación Paramedic',
    },
    servers: [
      {
        url: 'http://localhost:5001/api',  // Cambiado para que apunte al puerto 5001
      },
    ],
    components: {
      schemas: {
        Medication: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID de la medicación' },
            name: { type: 'string', description: 'Nombre del medicamento' },
            dosage: { type: 'string', description: 'Dosis del medicamento' },
            frequency: { type: 'integer', description: 'Frecuencia en horas' },
            startDate: { type: 'string', format: 'date-time', description: 'Fecha de inicio' },
            endDate: { type: 'string', format: 'date-time', description: 'Fecha de fin' },
          },
        },
        MedicationInput: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Nombre del medicamento' },
            dosage: { type: 'string', description: 'Dosis del medicamento' },
            frequency: { type: 'integer', description: 'Frecuencia en horas' },
            startDate: { type: 'string', format: 'date-time', description: 'Fecha de inicio' },
            endDate: { type: 'string', format: 'date-time', description: 'Fecha de fin' },
          },
          required: ['name', 'dosage', 'frequency', 'startDate', 'endDate'],
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Ruta donde están tus anotaciones Swagger
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Función para configurar Swagger
const setupSwaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📚 Swagger disponible en http://localhost:5001/api-docs');  // Cambiado a 5001 para reflejar el puerto correcto
};

module.exports = setupSwaggerDocs;
