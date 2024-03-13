import express from 'express';
import filters from './routes/filters';
const app = express();
const PORT = 3000;

// app.get('/', (req, res) => {
//     res.send('Hello, TypeScript with Express!');
// });

app.use(express.json());
app.use('/', filters);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});