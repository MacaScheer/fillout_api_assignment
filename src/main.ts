import express from 'express';
import filters from './routes/filters';
// import { validateInput } from './validators/formValidator';
const app = express();

const PORT = 3000;
app.get('/', filters);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});