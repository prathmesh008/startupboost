import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { establishDataLink } from './wires/database';
import trafficController from './routes/access_point';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security Protocols
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Restricted access
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Boot Sequence
const bootSystem = async () => {
    await establishDataLink();

    // Mount Router
    app.use('/api/v1', trafficController);

    app.get('/', (req, res) => {
        res.send(':: Core System Online ::');
    });

    app.listen(PORT, () => {
        console.log(`>> Core System: Active on Port ${PORT}`);
    });
};

bootSystem();
