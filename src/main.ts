import express from 'express';
import filters from './routes/filters';
import { config } from 'dotenv';

const app = express();
const port = process.env.PORT;
app.get('/', (req, res) => {
    res.send("<h1>HELLO FROM RAILWAY</h1>");
});
// app.get('/', filters);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});