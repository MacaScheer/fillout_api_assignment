import express from 'express';
import filters from './routes/filters';
import { config } from 'dotenv';

config();
const app = express();
const port = process.env.PORT;

app.get('/', filters);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});