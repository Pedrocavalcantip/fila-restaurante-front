# 👑 Fila Restaurante API - Documentação Técnica (v1.0.0)

**Descrição:** Sistema de Gerenciamento de Filas para Restaurantes (MVP).
**Tecnologias:** Node.js, WebSocket (Real-time), Docker, PostgreSQL, Zod Validation, JWT Auth.

## 🧠 Arquitetura e Regras de Negócio
* [cite_start]**Multi-Tenant:** Isolamento total de dados por restaurante[cite: 8].
* [cite_start]**Dual-Mode:** Suporte a tickets presenciais (gerados por operador) e remotos (app do cliente)[cite: 9].
* [cite_start]**Real-Time:** Atualizações instantâneas via WebSocket para chamadas de tickets[cite: 10].
* **Priorização Inteligente:**
    * `NORMAL`: Fila padrão.
    * `FAST_LANE`: Fila rápida (paga/premium).
    * `VIP`: Prioridade máxima.
    * [cite_start]*Regra:* Cálculo dinâmico baseado em tempo de espera e status[cite: 11].
* [cite_start]**Segurança:** Senhas com bcrypt, Tokens JWT para sessão, Rate Limiting[cite: 13].

---

## 🔐 1. Autenticação e Usuários

### POST `/auth/login`
**Login de Operador/Admin.**
* [cite_start]**Body:** `{ email, senha, restauranteSlug }` [cite: 37-39].
* [cite_start]**Response 200:** Retorna `token` e objeto `usuario` (com `role`: ADMIN/OPERADOR) [cite: 51-60].

### GET `/auth/me`
**Dados do Usuário Atual.**
* [cite_start]**Response 200:** Retorna dados do operador logado[cite: 77].

### POST `/auth/cliente/cadastro`
**Registro de Novo Cliente.**
* [cite_start]**Body:** `{ nome, email, telefone, senha, cpf, cidade, estado }` [cite: 87-94].
* [cite_start]**Response 201:** Retorna `token` e objeto `cliente` inicializado com contadores zerados (`totalVisitas`, `totalNoShows`, etc.) [cite: 112-127].

### POST `/auth/cliente/login`
**Login de Cliente.**
* [cite_start]**Body:** `{ email, senha }`[cite: 142].
* **Response 200:** Retorna `token` e dados do cliente.
* [cite_start]**Erro 403:** Cliente bloqueado[cite: 186].

### GET `/cliente/perfil`
**Perfil do Cliente.**
* [cite_start]**Response 200:** Dados completos do cliente autenticado[cite: 200].

---

## 🏢 2. Gestão de Restaurantes (Onboarding)

### POST `/restaurantes/cadastro`
**Novo Restaurante.**
* **Descrição:** Cria o Restaurante, o usuário Admin inicial e a Fila padrão.
* **Body:**
    ```json
    {
      "nome": "Restaurante Gourmet",
      "slug": "restaurante-gourmet",
      "emailAdmin": "admin@restaurante.com",
      "senhaAdmin": "senha1234",
      "precoFastlane": 15,
      "precoVip": 25,
      "maxReentradasPorDia": 3,
      ...outros_dados_endereco
    }
    ```
    [cite_start][cite: 211-227]
* [cite_start]**Response 201:** Retorna objetos `{ restaurante, admin, linkAcesso }` [cite: 239-260].

### GET `/restaurantes/meu-restaurante`
**Dados do Restaurante (Admin).**
* [cite_start]**Response 200:** Retorna configurações, preços e status do restaurante [cite: 289-301].

---

## 🎟️ 3. Tickets - Fluxo Operador (Local)

### POST `/tickets/filas/{filaId}/tickets`
**Criar Ticket Presencial.**
* [cite_start]**Body:** `{ nomeCliente, telefone, quantidadePessoas, observacoes }` [cite: 329-333].
* [cite_start]**Response 201:** Cria ticket com status `AGUARDANDO` e gera número (ex: "A-023") [cite: 345-351].

### GET `/tickets/filas/{filaId}/tickets/ativa`
**Monitor de Fila Ativa.**
* **Response 200:**
    * `fila`: Dados da fila.
    * `tickets`: Lista de tickets ativos.
    * [cite_start]`estatisticas`: `{ totalAguardando, totalChamados }` [cite: 397-422].

### GET `/tickets/filas/{filaId}/tickets/historico`
**Histórico de Tickets.**
* [cite_start]**Query Params:** `status` (FINALIZADO, CANCELADO, NO_SHOW), `busca`, `page`, `limit` [cite: 442-456].
* [cite_start]**Response 200:** Lista paginada de tickets antigos [cite: 481-507].

### GET `/tickets/{ticketId}`
**Detalhes do Ticket.**
* [cite_start]**Response 200:** Inclui array de `eventos` (log de ações no ticket) [cite: 557-561].

### POST `/tickets/{ticketId}/chamar`
**Chamar Próximo.**
* **Ação:** Muda status `AGUARDANDO` -> `CHAMADO`. Emite evento WebSocket.
* [cite_start]**Response 200:** Ticket atualizado[cite: 586].

### POST `/tickets/{ticketId}/finalizar`
**Concluir Atendimento.**
* **Ação:** Muda status para `FINALIZADO`. Confirma pagamento se houver.
* [cite_start]**Response 200:** Retorna timestamp `finalizadoEm` [cite: 616-619].

### POST `/tickets/{ticketId}/rechamar`
**Rechamar Cliente.**
* **Ação:** Incrementa `contagemRechamada`. [cite_start]Mantém status `CHAMADO`[cite: 627, 658].

### POST `/tickets/{ticketId}/pular`
**Pular Vez.**
* [cite_start]**Ação:** Retorna ticket para o fim da fila (`CHAMADO` -> `AGUARDANDO`)[cite: 668, 691].

### POST `/tickets/{ticketId}/no-show`
**Cliente não apareceu.**
* [cite_start]**Ação:** Status `NO_SHOW`, incrementa estatística do cliente[cite: 700].

### POST `/tickets/{ticketId}/cancelar`
**Cancelamento Operacional.**
* [cite_start]**Body:** `{ motivo }`[cite: 719].
* [cite_start]**Response 200:** Status `CANCELADO`[cite: 737].

---

## 📱 4. Tickets - Fluxo Cliente (Remoto)

### GET `/cliente/restaurantes/proximos`
**Buscar Restaurantes.**
* [cite_start]**Response 200:** Lista restaurantes na mesma cidade/estado do cliente, incluindo dados da `filaAtiva` (tamanho da fila) [cite: 925-942].

### POST `/cliente/restaurantes/{slug}/fila/entrar`
**Entrar na Fila (Check-in).**
* [cite_start]**Body:** `{ quantidadePessoas, prioridade, observacoes }` [cite: 765-768].
* **Response 201:** Retorna ticket e dados do restaurante.
* [cite_start]**Erros:** 400 (Já tem ticket), 403 (Limite de reentradas/Bloqueado) [cite: 814-817].

### GET `/cliente/meu-ticket`
**Meus Tickets.**
* [cite_start]**Response 200:** Lista histórico completo de tickets do cliente[cite: 839].

### POST `/cliente/ticket/{ticketId}/cancelar`
**Sair da Fila.**
* [cite_start]**Response 200:** Status `CANCELADO_CLIENTE`[cite: 891].

---

## 🌍 5. Consulta Pública (Painel/TV)

### GET `/tickets/publico/{ticketId}`
**Status do Ticket (Sem Auth).**
* [cite_start]**Response 200:** Dados públicos do ticket (nome, número, posição) [cite: 978-989].

### GET `/tickets/publico/{ticketId}/posicao`
**Polling de Posição.**
* **Response 200:**
    ```json
    {
      "ticketId": "uuid",
      "posicao": 3,
      "tempoEstimado": 15,
      "tempoEstimadoFormatado": "~15 minutos"
    }
    ```
    [cite_start][cite: 1025-1030].

---

## 🧱 Schemas de Dados (Modelos)

### Entidade: Cliente
* `id`, `nome`, `email`, `telefone`, `cpf`, `cidade`, `estado`.
* **Flags:** `isVip` (boolean), `vipDesde` (date).
* **Stats:** `totalVisitas`, `totalFastLane`, `totalVip`, `totalNoShows`.
* **Status:** `ATIVO` | `BLOQUEADO`.
[cite_start][cite: 1046]

### Entidade: Restaurante
* `id`, `nome`, `slug`, `telefone`, `email`, `cidade`, `estado`.
* **Config:** `precoFastLane`, `precoVip`, `maxReentradasPorDia`, `tempoMedioAtendimento`.
* **Status:** `ATIVO`.
[cite_start][cite: 1050]

### Entidade: Ticket
* `id`, `numero` (ex: "A-023"), `filald`, `clienteId`.
* **Dados:** `nomeCliente`, `telefone`, `quantidadePessoas`.
* **Controle:**
    * `prioridade`: `NORMAL` | `FAST_LANE` | `VIP`.
    * `status`: `AGUARDANDO` | `CHAMADO` | `FINALIZADO` | `NO_SHOW` | `CANCELADO`.
* **Métricas:** `posicao`, `tempoEstimadoMinutos`, `chamadasCount`.
[cite_start][cite: 1057-1087]