# Mapeamento de Endpoints da API - Sistema SANEM

Este documento descreve a estrutura da API RESTful para o Sistema de Gerenciamento de Doações SANEM, com base nos requisitos funcionais (RFs) e casos de uso definidos.

##  Autenticação

-   `POST /login`
    -   **Descrição:** Autentica um usuário (`Voluntario` ou `Administrador`) e retorna um token de acesso (JWT).
    -   **Perfil de Acesso:** Público.
    -   **Corpo da Requisição:** `{ "email": "user@email.com", "senha": "user_password" }`

-   `GET /perfil`
    -   **Descrição:** Retorna as informações do usuário atualmente logado, com base no token JWT enviado.
    -   **Perfil de Acesso:** Administrador, Voluntário.

---

## Gerenciamento de Voluntários (Usuários)

-   `POST /voluntarios`
    -   **Requisito Associado:** RF01 (Gerenciamento de Usuários e Perfis).
    -   **Descrição:** Cria um novo usuário do sistema (Voluntário ou Administrador).
    -   **Perfil de Acesso:** Administrador.
    -   **Corpo da Requisição:** `{ "nome": "...", "email": "...", "senha": "...", "role": "VOLUNTARIO" }`

-   `GET /voluntarios`
    -   **Requisito Associado:** RF01.
    -   **Descrição:** Lista todos os usuários cadastrados.
    -   **Perfil de Acesso:** Administrador.

-   `PUT /voluntarios/:id`
    -   **Requisito Associado:** RF01.
    -   **Descrição:** Atualiza as informações de um usuário (nome, perfil, etc.).
    -   **Perfil de Acesso:** Administrador.

-   `DELETE /voluntarios/:id`
    -   **Requisito Associado:** RF01.
    -   **Descrição:** Desativa ou remove um usuário do sistema.
    -   **Perfil de Acesso:** Administrador.

---

## Gerenciamento de Beneficiários

-   `POST /beneficiarios`
    -   **Requisito Associado:** RF04 (Cadastro de Beneficiários).
    -   **Descrição:** Cadastra um novo beneficiário com status inicial "pendente" (`apto: false`).
    -   **Perfil de Acesso:** Administrador, Voluntário.
    -   **Corpo da Requisição:** `{ "nome": "...", "cpf": "...", "renda": 1200.00, ... }`

-   `GET /beneficiarios`
    -   **Requisito Associado:** RF04.
    -   **Descrição:** Lista todos os beneficiários. Permite filtros por status (ex: `?apto=false`).
    -   **Perfil de Acesso:** Administrador, Voluntário.

-   `GET /beneficiarios/:id`
    -   **Requisito Associado:** RF04.
    -   **Descrição:** Busca os detalhes de um beneficiário específico.
    -   **Perfil de Acesso:** Administrador, Voluntário.

-   `PUT /beneficiarios/:id`
    -   **Requisitos Associados:** RF05 (Aprovação), RF07 (Limite Mensal).
    -   **Descrição:** Atualiza um beneficiário. Usado por um `Administrador` para aprovar/rejeitar (`apto`) e para definir o `limite_mensal`.
    -   **Perfil de Acesso:** Administrador.

-   `POST /beneficiarios/:id/cartao`
    -   **Requisito Associado:** RF09 (Emissão de Cartão para Retirada).
    -   **Descrição:** Associa ou gera um cartão de retirada para um beneficiário aprovado.
    -   **Perfil de Acesso:** Administrador.

---

## Gerenciamento de Doações e Estoque

-   `POST /doacoes`
    -   **Requisito Associado:** RF02 (Cadastro de Itens Doados).
    -   **Descrição:** Registra um "evento de doação", contendo uma lista de itens recebidos. O backend deve adicionar esses itens ao estoque.
    -   **Perfil de Acesso:** Administrador, Voluntário.
    -   **Corpo da Requisição:** `{ "voluntarioId": 1, "itens": [{ "tipo": "Roupa", "descricao": "Camisa de algodão", "tamanho": "M", "quantidade": 5 }, ...] }`

-   `GET /doacoes`
    -   **Requisito Associado:** RF11 (Consulta ao Histórico de Doações).
    -   **Descrição:** Lista o histórico de todos os eventos de doação.
    -   **Perfil de Acesso:** Administrador, Voluntário.

-   `GET /estoque`
    -   **Requisito Associado:** RF03 (Gerenciamento de Estoque).
    -   **Descrição:** Consulta o estoque atual de itens disponíveis para distribuição. Permite filtros.
    -   **Perfil de Acesso:** Administrador, Voluntário.

-   `PUT /estoque/itens/:id`
    -   **Requisito Associado:** RF03.
    -   **Descrição:** Atualiza as informações de um item específico no estoque (ex: corrigir tipo, tamanho).
    -   **Perfil de Acesso:** Administrador, Voluntário.

---

## Gerenciamento de Distribuições

-   `POST /distribuicoes`
    -   **Requisitos Associados:** RF06 (Registro de Distribuição), RF07 (Aplicação de Limite Mensal).
    -   **Descrição:** Registra a retirada de um ou mais itens por um beneficiário. O backend **deve** validar o limite mensal e dar baixa automática no estoque.
    -   **Perfil de Acesso:** Administrador, Voluntário.
    -   **Corpo da Requisição:** `{ "voluntarioId": 1, "beneficiarioId": 1, "itens": [{ "itemDoacaoId": 1, "quantidade": 1 }, ...] }`

-   `GET /distribuicoes`
    -   **Requisito Associado:** RF11 (Consulta ao Histórico de Doações).
    -   **Descrição:** Lista o histórico de todas as distribuições.
    -   **Perfil de Acesso:** Administrador, Voluntário.

---

## Relatórios

-   `GET /relatorios`
    -   **Requisito Associado:** RF10 (Geração de Relatórios).
    -   **Descrição:** Gera relatórios consolidados que podem ser exportados. O tipo e o formato são definidos por query params.
    -   **Perfil de Acesso:** Administrador.
    -   **Exemplo de Requisição:** `GET /relatorios?tipo=distribuicoes&formato=pdf&de=2025-01-01&ate=2025-01-31`

---

## Gerenciamento de Características de Ítens do Catálogo


### Gerenciamento de Tipos

-   `GET /tipos`
    -   **Descrição:** Lista todos os tipos de itens para popular formulários.
    -   **Perfil de Acesso:** Administrador, Voluntário.

### Gerenciamento de Tamanhos

-   `GET /tamanhos`
    -   **Descrição:** Lista todos os tamanhos, permitindo filtrar por tipo (ex: `?tipoId=1`).
    -   **Perfil de Acesso:** Administrador, Voluntário.

### Gerenciamento de Condições

-   `GET /condicoes`
    -   **Descrição:** Lista todas as condições de um item ("Novo","Usado","Pouco Usado").
    -   **Perfil de Acesso:** Administrador, Voluntário.

-   `POST /condicoes`
    -   **Descrição:** Adiciona uma nova condição na lista.
    -   **Perfil de Acesso:** Administrador, Voluntário.

-   `PUT /condicoes`
    -   **Descrição:** Edita uma condição usando o id.
    -   **Perfil de Acesso:** Administrador, Voluntário.

-   `DELETE /condicoes`
    -   **Descrição:** Lista todas as condições de um item ("Novo","Usado","Pouco Usado")
    -   **Perfil de Acesso:** Administrador, Voluntário.