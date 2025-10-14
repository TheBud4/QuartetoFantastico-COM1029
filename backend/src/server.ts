import express, { Request, Response } from "express";
import startServer from "./scripts/startServer";
// Importa as rotas de doação
import doacaoRoutes from './routes/doacao.routes';
// Importa as rotas de tipo tamanho e condicao
import tipoRoutes from './routes/tipo.routes';
import tamanhoRoutes from './routes/tamanho.routes';
import condicaoRoutes from './routes/condicao.routes';

const app = express();
app.use(express.json()); // Middleware para interpretar JSON no corpo das requisições

/**
 * @route GET /
 * @description Rota Hello World (feita por superstição rs)
 * @access Público
 */
app.get("/", (req: Request, res: Response) => {
  const request =req.body;
  res.send(request);
  //res.send("Hello, World!");
  
});

// Rotas de doação
app.use('/doacoes', doacaoRoutes);

// Rotas de tipo, tamanho e condição
app.use('/tipos', tipoRoutes);
app.use('/tamanhos', tamanhoRoutes);
app.use('/condicoes', condicaoRoutes);

startServer(app);

