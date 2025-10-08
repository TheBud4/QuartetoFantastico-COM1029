import express, { Request, Response } from "express";
import env from "./config/env";
const app = express();

/**
 * @route GET /
 * @description Rota principal da aplicação.
 * @access Público
 */
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

/**
 * Inicia o servidor e fica à escuta na porta definida.
 */
app.listen(env.PORT, () => {
  console.log(`Server running at http://localhost:${env.PORT}`);
});
