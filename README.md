## Oficina Quarteto Fantastico

Um sistema de gerenciamento de estoque feito com Express e React.

---

## 📋 Índice

- [📦 Sobre o Projeto](#-sobre-o-projeto)
- [🚀 Tecnologias](#-tecnologias)
- [⚙️ Instalação](#️-instalação)
- [🧪 Como Usar](#-como-usar)
- [📄 Documentação](#-documentação-)
- [🛠 Funcionalidades](#-funcionalidades)
- [🧑‍💻 Contribuindo](#-contribuindo)
- [📄 Licença](#-licença)

---

## 📦 Sobre o Projeto

O nosso projeto tem como objetivo desenvolver um aplicativo para a SANEM, cumprindo as necessidades dos usuários e fazendo o controle de doações.

---

## 🚀 Tecnologias

**Frontend**
- React + Vite
- CSS Modules

**Backend**
- Node.js + Express (TypeScript)
- Prisma ORM (PostgreSQL) com driver adapter `@prisma/adapter-pg`
- Autenticação JWT (`jsonwebtoken`)
- Validação com Zod
- Documentação OpenAPI/Swagger (`swagger-jsdoc` + `swagger-ui-express`)

**Infra**
- Docker e Docker Compose
- Scripts de migração/seed via Prisma

---

## ⚙️ Instalação

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure o `.env` (backend e frontend, se necessário) com as variáveis de banco, JWT e seed.

3. Suba os serviços com Docker:

   ```bash
   docker compose up --build
   ```

---

## 🧪 Como usar

1. Acesse o backend em `http://localhost:3000`.
2. Documentação da API: `http://localhost:3000/apidocs` (UI) ou `http://localhost:3000/apidocs.yaml` (YAML).
3. Rodar migrações manualmente (se necessário):

   ```bash
   docker compose exec app npx prisma migrate deploy
   ```

4. Rodar o seed:

   ```bash
   docker compose exec app npx tsx prisma/seed.ts
   ```

   > Exige `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD` definidos no `.env`.

---

## 📄 Documentação

- Swagger UI: `http://localhost:3000/apidocs`
- OpenAPI YAML: `http://localhost:3000/apidocs.yaml`
- Documento de visão: [Google Docs](https://docs.google.com/document/d/1Wcm7rU8M-KzOWyroloNW2MCT5hMKPz27V5oUWZ41BAA/edit?tab=t.0#heading=h.t5lws1x1u33z)
- Prototipação: (em breve)
- Board/Trello: (em breve)

---

## 🛠 Funcionalidades

- Preview em tempo real
- Multiplataforma
- Gerenciamento do estoque de doações

---

## 🧑‍💻 Contribuindo

Apenas membros da equipe Quarteto Fantástico podem contribuir nesse projeto. Entretanto, possivelmente outra equipe do próximo semestre também contribuirá.

---

## 🙋‍♀️ Autores

### Primeiro Semestre

- [Amabilly Barbosa Russo](https://github.com/ambarussian) : Designing UX/UI
- [Fabiola Malman Nunes](https://github.com/FabiolaMnss) : Designing UX/UI
- [Gabrieli Machado Bianchin](https://github.com/GabrieliMachadoBianchin) : SM, QA, Engenheira de Requisitos
- [Henrique Vicente Iha](https://github.com/catchdark) : Front End
- [Herick Campos Calegari](https://github.com/HerickCallegari) : Back End
- [Vitor Hugo Klein](https://github.com/Vitor-Klein) : Front End

### Segundo Semestre

- [Rodrigo Caio Koelln Alfonsin](https://github.com/Ordered0) : Front/Back End
- [Luiz Felipe Bastião](https://github.com/LuizFelipeBastiao) : Front/Back End
- [Murilo Pistore Moreira Ramos](https://github.com/thebud4) : Scrum Master e Ajuda Geral
- [Yasmin Yamamoto de Melo](https://github.com/Yasmin-YY) : Front End

---

## 📄 Licença
Este projeto está licenciado sob a Licença MIT. Consulte o arquivo LICENSE para mais informações.
