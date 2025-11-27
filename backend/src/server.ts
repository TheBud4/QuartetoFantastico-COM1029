import express, { Request, Response } from "express";
import startServer from "./scripts/startServer";
import { setupSwagger } from "./config/swagger";

// Rota de autenticação
import authRoutes from './routes/auth.routes';

// Importa as rotas de doação
import doacaoRoutes from './routes/doacao.routes';

// Importa as rotas de item
import tipoRoutes from './routes/tipo.routes';
import tamanhoRoutes from './routes/tamanho.routes';
import condicaoRoutes from './routes/condicao.routes';

//rotas de beneficiarios
import beneficiarioRoutes from './routes/beneficiario.routes';
import cartaoRoutes from './routes/cartao.routes';

//rotas de voluntarios
import voluntarioRoutes from './routes/voluntario.routes';


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

//rotas de voluntarios
app.use('/voluntarios', voluntarioRoutes);

// Rota de autenticação
app.use('/auth', authRoutes);

startServer(app);

