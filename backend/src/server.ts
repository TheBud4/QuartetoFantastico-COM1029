import express, { Request, Response } from "express";
import startServer from "./scripts/startServer";
import doacaoRoutes from './routes/doacao.routes';

const app = express();
app.use(express.json()); // Middleware para interpretar JSON no corpo das requisições

/**
 * @route GET /
 * @description Rota principal da aplicação.
 * @access Público
 */
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
  
});
app.use('/doacoes', doacaoRoutes);


startServer(app);

