import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import env from "../config/env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Doações SANEM',
      version: '2.0.0',
      description:
        `Documentação 
        interativa da
        API RESTful para o sistema de gerenciamento de
        doações da SANEM. Esta interface tem o objetivo de
        facilitar a interação com os endpoints da API.`,
    },
    // Para OpenAPI 3.0, é recomendado usar 'servers' em vez de 'host' e 'basePath'
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Servidor de Desenvolvimento Local'
      }
    ]
    // O BLOCO 'paths: { ... }' FOI REMOVIDO DAQUI
  },

  // O caminho para a pasta de rotas. Ele vai ler TODOS os arquivos .ts aqui.
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  // Rota para a documentação da API
  app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
// import { Express } from 'express';
// import env from "../config/env";

// const options: swaggerJsdoc.Options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Sistema de Doações SANEM',
//       version: '2.0.0',
//       description:
//         `Documentação 
//         interativa da
//         API RESTful para o sistema de gerenciamento de
//         doações da SANEM. Esta interface tem o objetivo de
//         facilitar a interação com os endpoints da API.`,
//     },
//     host: `localhost:${env.PORT}`,
//     basePath: '/',
//     // paths: {
//     //   name: 'Raiz',
//     //   description: 'Endpoints da raiz',
//     //   '/': {
//     //     get: {
//     //       summary: 'Rota Principal, Retorna Hello World',
//     //       responses: {
//     //         200: {
//     //           description: 'Uma simples mensagem de hello world',
//     //           content: {
//     //             'application/json': {
//     //               schema: {
//     //                 type: 'object',
//     //                 properties: {
//     //                   Hello: {
//     //                     type: 'string',
//     //                     example: 'World'
//     //                   }
//     //                 }
//     //               }
//     //             }
//     //           }
//     //         }
//     //       }
//     //     }
//     //   }
//     // }
//   },

//   // O caminho para a pasta de rotas
//   apis: ['./src/routes/*.ts'],
// };

// const swaggerSpec = swaggerJsdoc(options);

// export function setupSwagger(app: Express) {
//   // Rota para a documentação da API
//   app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// }