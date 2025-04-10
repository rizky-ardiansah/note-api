import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectDB from './database/db.js';
import authRoutes from './routes/auth.route.js';
import noteRoutes from './routes/note.route.js';

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/notes', noteRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB()
})