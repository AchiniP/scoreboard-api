import Express from 'express';
import compression from 'compression';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import Router from './Router';
import ErrorHandler from './middleware/error/ErrorHandler';
const App = Express();
App.use(compression());
App.use(cors());
App.use(Express.urlencoded({ extended: true }));
App.use(Express.json());
App.use('/v1/', Router);

const options = {
    swaggerDefinition: {
        info: {
            title: 'LEADERBOARD API',
            version: '1.0.0',
            description: 'ScoreBoard API',
        },
    },
    apis: ['swagger.yaml'],
};

const specs = swaggerJSDoc(options);

App.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
App.use(ErrorHandler);

export default App;
