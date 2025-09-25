import express, { Request, Response } from "express";

const app = express();

const PORT = 3000;

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
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
