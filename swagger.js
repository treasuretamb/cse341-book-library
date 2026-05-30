const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Book Library API',
    description: 'API for managing a personal book library'
  },
  host: 'cse341-book-library.onrender.com',
  schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);