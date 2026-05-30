const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Book Library API',
    description: 'API for managing a personal book library'
  },
  host: 'localhost:8080',
  schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);