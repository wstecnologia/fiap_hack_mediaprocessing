import swaggerUi from 'swagger-ui-express';

import dotenv from "dotenv";
import express from "express";
import { RabbitMQFactory } from "../infrastructure/queue/RabbitMqFactory";
import { allRoutes } from "../infrastructure/web/express/routes";
import { swaggerSpec } from './swagger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const rabbitMq = new RabbitMQFactory(process.env.RABBIT_EXCHANGE,process.env.RABBIT_QUEUE,process.env.RABBIT_ROUTING_KEY)
rabbitMq.on()

app.use(express.json());
app.use(express.urlencoded({ extended: true })) 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', allRoutes);

export default app;