import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './configs/jsonwetoken.js'

const app = express();
app.use(express.json());
app.use(cors());

//startServer
connectDB();

//Middleware routes
app.get('/', (req, res) => {
    res.send({ data: 'Hello'})
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);

})

export default app;