const express = require('express');
import { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'this works' });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
