import express, { Request, Response } from "express";
import startServer from "./scripts/startServer";
import { setupSwagger } from "./config/swagger";

// Importa as rotas de doação
import doacaoRoutes from './routes/doacao.routes';
// Importa as rotas de tipo tamanho e condicao
import tipoRoutes from './routes/tipo.routes';
import tamanhoRoutes from './routes/tamanho.routes';
import condicaoRoutes from './routes/condicao.routes';
//rotas de beneficiarios
import beneficiarioRoutes from './routes/beneficiario.routes';
import cartaoRoutes from './routes/cartao.routes';

const app = express();
app.use(express.json());

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

//rotas de beneficiarios
app.use('/beneficiarios', beneficiarioRoutes);
app.use('/cartoes', cartaoRoutes);

startServer(app);

