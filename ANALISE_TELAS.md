# Análise Completa das Telas - Fila Restaurante Front-end

## ✅ TELAS IMPLEMENTADAS E STATUS

### 1. **EscolhaPerfil.jsx** - Tela Inicial
**Status:** ✅ OK
- Permite escolher entre Cliente e Restaurante
- **Faltando:** Nada, tela completa

---

### 2. **LoginCliente.jsx** - Login do Cliente
**Status:** ⚠️ INCOMPLETO
- **Implementado:**
  - Formulário de login (email, senha)
  - Mock de autenticação
- **Faltando:**
  - Integração real com `/auth/cliente/login`
  - Tratamento de erro 403 (cliente bloqueado)
  - Salvar token JWT no localStorage
  - Validação com Zod

---

### 3. **CadastroCliente.jsx** - Cadastro de Cliente
**Status:** ⚠️ INCOMPLETO
- **Implementado:**
  - Formulário básico
- **Faltando:**
  - Campos obrigatórios: `cpf`, `cidade`, `estado`
  - Integração com `/auth/cliente/cadastro`
  - Validação de CPF
  - Tratamento de erros

---

### 4. **PerfilCliente.jsx** - Perfil do Cliente
**Status:** ⚠️ INCOMPLETO
- **Implementado:**
  - Estrutura básica
- **Faltando:**
  - Integração com `/cliente/perfil`
  - Exibir estatísticas: `totalVisitas`, `totalNoShows`, `totalFastLane`, `totalVip`
  - Exibir status: `isVip`, `vipDesde`
  - Badge de cliente bloqueado se `status = BLOQUEADO`

---

### 5. **RestaurantesDisponiveis.jsx** - Buscar Restaurantes
**Status:** ⚠️ INCOMPLETO
- **Implementado:**
  - Lista de restaurantes (mock)
  - Modal para entrar na fila
- **Faltando:**
  - Integração com `/cliente/restaurantes/proximos`
  - Exibir tamanho da fila ativa de cada restaurante
  - Filtros por cidade/estado
  - Informações: `precoFastLane`, `precoVip`, `tempoMedioAtendimento`

---

### 6. **EntrarNaFila.jsx** - Entrar na Fila (Check-in)
**Status:** ⚠️ INCOMPLETO
- **Implementado:**
  - Formulário para entrar na fila
- **Faltando:**
  - Integração com `/cliente/restaurantes/{slug}/fila/entrar`
  - Campos: `quantidadePessoas`, `prioridade` (NORMAL/FAST_LANE/VIP), `observacoes`
  - Tratamento de erros:
    - 400: Já tem ticket ativo
    - 403: Limite de reentradas atingido ou cliente bloqueado
  - Mostrar preços de Fast Lane e VIP
  - Confirmação de pagamento se Fast Lane/VIP

---

### 7. **AcompanharFila.jsx** - Meu Ticket Ativo
**Status:** ⚠️ INCOMPLETO
- **Implementado:**
  - Estrutura básica
- **Faltando:**
  - Integração com `/cliente/meu-ticket`
  - Exibir: `numero`, `posicao`, `tempoEstimadoMinutos`, `status`
  - WebSocket para atualizações em tempo real
  - Botão "Cancelar Ticket" com integração `/cliente/ticket/{ticketId}/cancelar`
  - Polling de posição via `/tickets/publico/{ticketId}/posicao`

---

### 8. **LoginRestaurante.jsx** - Login Operador/Admin
**Status:** ⚠️ INCOMPLETO
- **Implementado:**
  - Formulário de login
  - Mock de autenticação
- **Faltando:**
  - Campo `restauranteSlug` no formulário
  - Integração com `/auth/login`
  - Salvar `role` (ADMIN/OPERADOR) no localStorage
  - Redirecionar para painel baseado na role

---

### 9. **CadastroRestaurante.jsx** - Onboarding Restaurante
**Status:** ⚠️ INCOMPLETO
- **Implementado:**
  - Formulário básico
- **Faltando:**
  - Todos os campos obrigatórios:
    - `nome`, `slug`, `emailAdmin`, `senhaAdmin`
    - `precoFastlane`, `precoVip`, `maxReentradasPorDia`
    - Endereço: `cidade`, `estado`, `cep`, etc.
  - Integração com `/restaurantes/cadastro`
  - Exibir `linkAcesso` após cadastro
  - Validação de slug único

---

### 10. **PainelAdministrativo.jsx** - Dashboard Admin
**Status:** ✅ OK
- Permite escolher entre Gerenciamento e Painel do Operador
- **Faltando:** Nada, tela de navegação completa

---

### 11. **Gerenciamento.jsx** - Gerenciamento de Equipe
**Status:** ⚠️ INCOMPLETO
- **Implementado:**
  - Lista de membros (mock)
  - Modal para adicionar operador
  - Ações: editar, remover
- **Faltando:**
  - Não há endpoint específico no backend documentado para gestão de usuários
  - Integração com backend (endpoints não documentados)
  - Edição de operadores
  - Atribuição de filas a operadores

---

### 12. **GerenciamentoFilas.jsx** - Gerenciamento de Filas
**Status:** ❌ NÃO INTEGRADO
- **Implementado:**
  - Lista de filas (mock)
  - Modal para criar fila
- **Faltando:**
  - Backend não documenta endpoints para CRUD de filas individuais
  - Apenas criação automática na `/restaurantes/cadastro`
  - Necessário endpoints:
    - `GET /filas` - listar filas
    - `POST /filas` - criar fila
    - `PUT /filas/{id}` - editar fila
    - `DELETE /filas/{id}` - excluir fila

---

### 13. **PainelOperador.jsx** - Fila ao Vivo (Operador)
**Status:** ⚠️ MUITO INCOMPLETO
- **Implementado:**
  - Lista de tickets (mock)
  - Estatísticas (mock)
  - Botões de ação
- **Faltando:**
  - **Integração essencial com múltiplos endpoints:**
    - `POST /tickets/filas/{filaId}/tickets` - Criar ticket presencial
    - `GET /tickets/filas/{filaId}/tickets/ativa` - Listar fila ativa
    - `POST /tickets/{ticketId}/chamar` - Chamar próximo
    - `POST /tickets/{ticketId}/finalizar` - Finalizar atendimento
    - `POST /tickets/{ticketId}/rechamar` - Rechamar
    - `POST /tickets/{ticketId}/pular` - Pular vez
    - `POST /tickets/{ticketId}/no-show` - Marcar no-show
    - `POST /tickets/{ticketId}/cancelar` - Cancelar ticket
  - WebSocket para atualizações em tempo real
  - Modal para criar ticket presencial (campos: `nomeCliente`, `telefone`, `quantidadePessoas`, `observacoes`)
  - Exibir eventos/log de cada ticket
  - Botão de refresh automático

---

## ❌ TELAS FALTANDO (NÃO CRIADAS)

### 1. **HistoricoTickets.jsx** - Histórico de Tickets (Operador)
**Endpoint:** `GET /tickets/filas/{filaId}/tickets/historico`
- **Funcionalidades necessárias:**
  - Filtros: status (FINALIZADO, CANCELADO, NO_SHOW), busca, paginação
  - Lista paginada de tickets antigos
  - Detalhes de cada ticket ao clicar

### 2. **DetalhesTicket.jsx** - Detalhes do Ticket
**Endpoint:** `GET /tickets/{ticketId}`
- **Funcionalidades necessárias:**
  - Todas as informações do ticket
  - Log de eventos (array de `eventos`)
  - Histórico de ações (chamadas, rechamadas, etc.)

### 3. **PainelPublico.jsx** - Painel/TV (Display Público)
**Endpoints:**
- `GET /tickets/publico/{ticketId}` - Status público
- `GET /tickets/publico/{ticketId}/posicao` - Polling de posição
- **Funcionalidades necessárias:**
  - Exibição em TV/tela grande
  - Mostrar tickets chamados
  - Atualização automática
  - Sem necessidade de autenticação

### 4. **ConfiguracoesRestaurante.jsx** - Editar Restaurante
**Endpoint:** `GET /restaurantes/meu-restaurante` (já existe)
- **Funcionalidades necessárias:**
  - Editar preços: `precoFastLane`, `precoVip`
  - Editar: `maxReentradasPorDia`, `tempoMedioAtendimento`
  - Dados de contato e endereço

### 5. **HistoricoClienteTickets.jsx** - Histórico Completo do Cliente
**Endpoint:** `GET /cliente/meu-ticket` (retorna histórico completo)
- **Funcionalidades necessárias:**
  - Lista de todos os tickets do cliente
  - Filtros por status
  - Estatísticas pessoais

---

## 📊 RESUMO GERAL

### Por Componente:
- ✅ **Completas:** 2 (EscolhaPerfil, PainelAdministrativo)
- ⚠️ **Incompletas:** 11 (necessitam integração com backend)
- ❌ **Faltando:** 5 telas importantes

### Por Funcionalidade:
- **Autenticação:** 40% implementado (estrutura ok, falta integração)
- **Cliente - Entrar na Fila:** 30% implementado
- **Cliente - Acompanhar Ticket:** 20% implementado
- **Operador - Gerenciar Fila:** 30% implementado
- **Admin - Onboarding:** 40% implementado
- **Painel Público:** 0% (não criado)

---

## 🚨 PRIORIDADES CRÍTICAS

### Alta Prioridade:
1. **Integrar autenticação real** (login cliente e restaurante)
2. **PainelOperador completo** (coração do sistema)
3. **AcompanharFila com WebSocket** (experiência do cliente)
4. **Criar PainelPublico** (display TV/painel)

### Média Prioridade:
5. Completar cadastros (cliente e restaurante)
6. Histórico de tickets
7. Detalhes de ticket com eventos
8. Configurações do restaurante

### Baixa Prioridade:
9. CRUD de filas (backend não documentado)
10. Gestão de equipe completa (backend não documentado)

---

## 🔧 RECOMENDAÇÕES TÉCNICAS

### 1. **WebSocket Integration**
- Implementar conexão WebSocket para:
  - Atualizações de posição na fila
  - Notificações de chamada
  - Painel público em tempo real

### 2. **API Service Layer**
- Criar `src/services/api.js` completo com todos os endpoints
- Implementar interceptors para JWT
- Tratamento global de erros

### 3. **State Management**
- Considerar Context API ou Zustand para:
  - Estado de autenticação
  - Dados do usuário logado
  - Conexão WebSocket

### 4. **Validação**
- Implementar Zod schemas no front-end
- Validar campos antes de enviar ao backend

### 5. **Responsividade**
- Garantir todas as telas sejam mobile-friendly
- PainelPublico otimizado para TVs/displays grandes
