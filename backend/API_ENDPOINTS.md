
## Mapeamento de Endpoints da Aplicação

### RF01: Gerenciamento de Usuários e Perfis

-   **Recurso:** `/usuarios`
-   **Acesso:** Apenas `Administrador`
-   **Endpoints:**
    -   `POST /usuarios` - Cria um novo usuário (voluntário ou administrador).
    -   `GET /usuarios` - Lista todos os usuários.
    -   `GET /usuarios/:id` - Obtém os detalhes de um usuário específico.
    -   `PUT /usuarios/:id` - Atualiza um usuário existente.
    -   `DELETE /usuarios/:id` - Remove um usuário.

### RF04 e RF05: Cadastro e Aprovação de Beneficiários

-   **Recurso:** `/beneficiarios`
-   **Acesso:** `Voluntário` para criar/listar, `Administrador` para aprovar/gerir.
-   **Endpoints:**
    -   `POST /beneficiarios` - Um `Voluntário` cadastra um novo beneficiário (com status "pendente").
    -   `GET /beneficiarios` - Lista todos os beneficiários com os seus status.
    -   `GET /beneficiarios/:id` - Obtém os detalhes de um beneficiário.
    -   `PUT /beneficiarios/:id` - Um `Administrador` atualiza os dados de um beneficiário (incluindo o status para "Aprovado" ou "Rejeitado").

### RF02 e RF03: Cadastro e Gerenciamento de Itens (Estoque)

-   **Recurso:** `/itens`
-   **Acesso:** `Voluntário` e `Administrador`.
-   **Endpoints:**
    -   `POST /itens` - Um `Voluntário` registra um novo item recebido em doação.
    -   `GET /itens` - Lista todos os itens disponíveis no estoque.
    -   `GET /itens/:id` - Obtém os detalhes de um item específico.
    -   `PUT /itens/:id` - Atualiza as informações de um item.

### RF06 e RF07: Registro de Distribuição e Limite Mensal

-   **Recurso:** `/distribuicoes`
-   **Acesso:** `Voluntário` e `Administrador`.
-   **Endpoints:**
    -   `POST /distribuicoes` - Um `Voluntário` registra uma nova retirada de itens para um beneficiário. A lógica do backend deve validar o limite mensal (RF07) antes de confirmar a operação.
    -   `GET /distribuicoes` - Lista o histórico de distribuições realizadas.
    -   `GET /distribuicoes/:id` - Obtém os detalhes de uma distribuição específica.