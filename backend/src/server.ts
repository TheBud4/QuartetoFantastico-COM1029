import express, { Request, Response } from "express";
import startServer from "./scripts/startServer";
import { setupSwagger } from "./config/swagger";


// Importa as rotas de doação
import doacaoRoutes from './routes/doacao.routes';
// Importa as rotas de tipo tamanho e condicao
import tipoRoutes from './routes/tipo.routes';
import tamanhoRoutes from './routes/tamanho.routes';
import condicaoRoutes from './routes/condicao.routes';

const app = express();
app.use(express.json()); // Middleware para interpretar JSON no corpo das requisições

setupSwagger(app);


app.get("/", (req: Request, res: Response) => {
  res.send({
    "Hello": "World"
  });

});


// Rotas de doação
app.use('/doacoes', doacaoRoutes);

// Rotas de tipo, tamanho e condição
app.use('/tipos', tipoRoutes);
app.use('/tamanhos', tamanhoRoutes);
app.use('/condicoes', condicaoRoutes);

startServer(app);

