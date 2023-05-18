import express from 'express';
import 'dotenv/config';
//import { Request, Response } from 'express';
import { consultaCep } from './services/cep/consultaCep';
import { consultaNews } from './services/news/consultaNews';
import { consultaApod } from './services/nasa/consultaApod';
//ce49890889c54a5aa5cff3c0894e8a54
const app = express();
app.use(express.json());


app.get('/consultacep/:cep', consultaCep)
app.get('/consultanews/:palavrachave', consultaNews)
app.get('/consultaapod/', consultaApod)



app.listen(3000, ()=> console.log("RODANDO! "))
    