# Mapeamento de Endpoints da API - Sistema SANEM

Este documento descreve a estrutura da API RESTful para o Sistema de Gerenciamento de Doações SANEM, com base nos requisitos funcionais e casos de uso definidos no projeto.

##  Autenticação

Endpoints essenciais para o controle de acesso ao sistema, conforme **User Story 6.2**.

-   `POST /login`
    -   **Descrição:** Autentica um usuário (Voluntário ou Administrador) e retorna um token de acesso (JWT) para ser usado nas requisições subsequentes.
    -   **Perfil de Acesso:** Público.
    -   **Corpo da Requisição:** `{ "email": "user@email.com", "senha": "user_password" }`

-   `GET /perfil`
    -   **Descrição:** Retorna as informações do usuário que está autenticado (logado).
    -   **Perfil de Acesso:** Administrador, Voluntário.

---

## Gerenciamento de Usuários

Endpoints para atender ao **RF12** (Gerenciamento de Usuários) e **Caso de Uso 12**.

-   `POST /usuarios`
    -   **Descrição:** Cria um novo usuário no sistema (associado a uma `Pessoa`).
    -   **Perfil de Acesso:** Administrador.

-   `GET /usuarios`
    -   **Descrição:** Lista todos os usuários cadastrados.
    -   **Perfil de Acesso:** Administrador.

-   `GET /usuarios/:id`
    -   **Descrição:** Busca os detalhes de um usuário específico pelo seu ID.
    -   **Perfil de Acesso:** Administrador.

-   `PUT /usuarios/:id`
    -   **Descrição:** Atualiza as informações de um usuário (nome, perfil, status, etc.).
    -   **Perfil de Acesso:** Administrador.

-   `DELETE /usuarios/:id`
    -   **Descrição:** Desativa ou remove um usuário do sistema.
    -   **Perfil de Acesso:** Administrador.

---

## Gerenciamento de Beneficiários

Endpoints para atender aos **RF02, RF03, RF06** e **Casos de Uso 02, 03, 06**.

-   `POST /beneficiarios`
    -   **Descrição:** Cadastra uma nova pessoa e a associa como um beneficiário com o status inicial "Em análise".
    -   **Perfil de Acesso:** Administrador, Voluntário.

-   `GET /beneficiarios`
    -   **Descrição:** Lista todos os beneficiários, permitindo filtrar por status (ex: `?status=pendente`).
    -   **Perfil de Acesso:** Administrador, Voluntário.

-   `PUT /beneficiarios/:id`
    -   **Descrição:** Atualiza as informações de um beneficiário. Um `Administrador` pode usar este endpoint para alterar o status `apto` e o `limite_mensal`.
    -   **Perfil de Acesso:** Administrador (acesso total), Voluntário (acesso parcial).

-   `POST /beneficiarios/:id/cartao`
    -   **Descrição:** Associa ou gera um cartão de retirada para um beneficiário aprovado (RF06).
    -   **Perfil de Acesso:** Administrador.

---

## Gerenciamento de Doações e Estoque

Endpoints para atender aos **RF04, RF05, RF08** e **Casos de Uso 04, 05, 08**.

-   `POST /doacoes`
    -   **Descrição:** Registra um "evento de doação", contendo um ou mais itens recebidos. O corpo da requisição deve conter os detalhes dos itens, que serão adicionados ao estoque.
    -   **Perfil de Acesso:** Administrador, Voluntário.

-   `GET /doacoes`
    -   **Descrição:** Lista o histórico de todos os eventos de doação recebidos (RF10).
    -   **Perfil de Acesso:** Administrador, Voluntário.

-   `GET /estoque`
    -   **Descrição:** Consulta o estoque atual de todos os `ItemDoacao` disponíveis para distribuição (RF08). Permite filtros (ex: `?tipo=roupa`).
    -   **Perfil de Acesso:** Administrador, Voluntário.

-   `PUT /estoque/itens/:id`
    -   **Descrição:** Atualiza as informações de um item específico no estoque.
    -   **Perfil de Acesso:** Administrador, Voluntário.

---

## Gerenciamento de Distribuições

Endpoints para atender ao **RF07** e **Caso de Uso 07**.

-   `POST /distribuicoes`
    -   **Descrição:** Registra a retirada de um ou mais itens do estoque por um beneficiário. O backend **deve** validar o limite mensal (RF07) e dar baixa automática no estoque (RF05).
    -   **Perfil de Acesso:** Administrador, Voluntário.

-   `GET /distribuicoes`
    -   **Descrição:** Lista o histórico de todas as distribuições realizadas, permitindo filtros por beneficiário ou período (RF10).
    -   **Perfil de Acesso:** Administrador, Voluntário.

---

## Relatórios

Endpoints para atender ao **RF09** e **Caso de Uso 09**.

-   `GET /relatorios`
    -   **Descrição:** Gera relatórios consolidados. O tipo de relatório é definido por query params (ex: `?tipo=doacoes&de=2025-01-01&ate=2025-01-31`).
    -   **Perfil de Acesso:** Administrador.
    -   **Tipos possíveis:** `doacoes`, `distribuicoes`, `estoque_atual`.