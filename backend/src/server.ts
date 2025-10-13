import express, { Request, Response } from "express";
import startServer from "./scripts/startServer";


const app = express();

/**
 * @route GET /
 * @description Rota principal da aplicação.
 * @access Público
 */
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
  
});

// Inicia o servidor e fica à escuta na porta definida.
startServer(app);

