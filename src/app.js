import express from 'express';
import cookieParser from 'cookie-parser';

import { swaggerOptions } from './utils/swagger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import { mocksRouter } from './routes/mocks.router.js';

import { conectaDB } from './dbConn.js';
import { CONFIG } from './config/config.js';

const app = express();
const PORT = CONFIG.PORT
conectaDB(CONFIG.MONGO_URI, CONFIG.DB_NAME);

const specs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))


app.use(express.json());
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);


app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))
