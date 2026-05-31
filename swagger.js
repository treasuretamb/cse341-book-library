const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Book Library API',
    description: 'API for managing a personal book library'
  },
  host: 'cse341-book-library.onrender.com',
  schemes: ['https'],
  securityDefinitions: {
    OAuth2: {
      type: 'oauth2',
      authorizationUrl: 'https://cse341-book-library.onrender.com/auth/github',
      flow: 'implicit',
      scopes: {
        'user:email': 'Read user email'
      }
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);