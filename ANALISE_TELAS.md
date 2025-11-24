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

## ✅ TELAS RECÉM-CRIADAS (24/11/2025)

### 1. **HistoricoTickets.jsx** - Histórico de Tickets (Operador)
**Status:** ✅ CRIADO (aguardando integração)
**Endpoint:** `GET /tickets/filas/{filaId}/tickets/historico`
- **Implementado:**
  - Filtros por status (Todos, Finalizados, Cancelados, No-Show)
  - Busca por número, nome ou telefone
  - Paginação (10 tickets por página)
  - Tabela com informações detalhadas
  - Botão "Ver detalhes" para cada ticket
  - Mock data estruturado
- **Faltando:**
  - Integração real com API
  - Obter `filaId` do contexto/localStorage

### 2. **DetalhesTicket.jsx** - Detalhes do Ticket
**Status:** ✅ CRIADO (aguardando integração)
**Endpoint:** `GET /tickets/{ticketId}`
- **Implementado:**
  - Informações completas do cliente
  - Informações do ticket com status
  - Timeline de eventos (log de ações)
  - Observações e motivo de cancelamento
  - Badges para VIP e Fast Lane
  - Mock data estruturado incluindo array de `logs`
- **Faltando:**
  - Integração real com API
  - Mapear campo `eventos` do backend para `logs` do frontend

### 3. **PainelPublico.jsx** - Painel/TV (Display Público)
**Status:** ✅ CRIADO (aguardando integração)
**Endpoints:**
- `GET /tickets/publico/{ticketId}` - Status público
- `GET /tickets/publico/{ticketId}/posicao` - Polling de posição
- **Implementado:**
  - Design otimizado para TV/tela grande
  - Relógio em tempo real
  - Lista de tickets chamados recentemente
  - Animação de pulso no ticket mais recente
  - Auto-atualização a cada 3 segundos
  - Botão "Voltar" para sair do painel
  - Sem necessidade de autenticação
  - Mock data estruturado
- **Faltando:**
  - Integração real com API
  - WebSocket para notificações em tempo real
  - Endpoint para listar tickets chamados (não documentado no backend)

### 4. **ConfiguracoesRestaurante.jsx** - Editar Restaurante
**Status:** ✅ CRIADO (aguardando integração)
**Endpoints:**
- `GET /restaurantes/meu-restaurante` (buscar dados)
- `PATCH /restaurantes/meu-restaurante` (atualizar)
- **Implementado:**
  - Formulário completo de edição
  - Seções: Informações da Empresa, Endereço, Precificação, Limites e Tolerâncias, Mensagem de Boas-Vindas
  - Campos: `precoFastLane`, `precoVip`, `limiteTicketsPorCliente`, `tempoToleranciaMinutos`
  - Máscaras para CNPJ, telefone e CEP
  - Botão "Salvar Configurações"
  - Mock data estruturado
- **Faltando:**
  - Integração real com API
  - ⚠️ **PROBLEMA IDENTIFICADO:** Backend usa `precoFastlane` (sem camelCase correto) mas frontend usa `precoFastLane`
  - Campo `maxReentradasPorDia` no backend vs `limiteTicketsPorCliente` no frontend (revisar nomenclatura)

### 5. **HistoricoClienteTickets.jsx** - Histórico Completo do Cliente
**Status:** ✅ CRIADO (aguardando integração)
**Endpoint:** `GET /cliente/meu-ticket` (retorna histórico completo)
- **Implementado:**
  - Cards de estatísticas (total, finalizados, cancelados, no-shows, tempo médio)
  - Lista completa de tickets do cliente
  - Filtros por status (Todos, Finalizados, Cancelados, No-Show)
  - Informações detalhadas: restaurante, data, tempo de espera, valor pago
  - Design responsivo
  - Mock data estruturado
- **Faltando:**
  - Integração real com API
  - Cálculo de estatísticas a partir dos dados retornados

---

## 🐛 PROBLEMAS E INCONSISTÊNCIAS IDENTIFICADOS

### 1. **Nomenclatura de Campos Divergentes**

#### Backend → Frontend
- ❌ `precoFastlane` (backend) ≠ `precoFastLane` (frontend)
- ❌ `maxReentradasPorDia` (backend) ≠ `limiteTicketsPorCliente` (frontend)
- ✅ `quantidadePessoas` - OK (ambos iguais)
- ✅ `observacoes` - OK (ambos iguais)

**Ação necessária:** Padronizar nomenclatura ou criar mapeamento na camada de serviços.

---

### 2. **Campo `restauranteSlug` Ausente nos Cadastros**

#### CadastroCliente.jsx
- **Backend espera:** `{ nomeCompleto, email, telefone, senha, cpf, cidade, estado, restauranteSlug }`
- **Frontend envia:** Falta campo `restauranteSlug`
- **Problema:** Backend documenta que cadastro de cliente precisa de `restauranteSlug`, mas isso não faz sentido para cadastro de cliente
- **Solução:** Cliente não deve ter `restauranteSlug` no cadastro (bug na documentação do backend?)

#### LoginCliente.jsx e LoginRestaurante.jsx
- **Backend espera:** `{ email, senha, restauranteSlug }` em ambos
- **Frontend:** LoginCliente não tem campo `restauranteSlug`
- **Frontend:** LoginRestaurante tem campo mas não está sendo usado
- **Problema crítico:** Como cliente faz login sem informar restaurante?

**Ação necessária:** Revisar arquitetura de autenticação multi-tenant.

---

### 3. **Campos Ausentes em Cadastros**

#### CadastroCliente.jsx
- **Faltam campos obrigatórios:** `cpf`
- **Campo presente no form mas não documentado:** Todos os campos estão presentes

#### CadastroRestaurante.jsx
- **Backend espera:**
  ```json
  {
    "nome", "slug", "emailAdmin", "senhaAdmin",
    "precoFastlane", "precoVip", "maxReentradasPorDia",
    "endereco": { ... dados completos ... }
  }
  ```
- **Frontend tem:** Formulário completo mas alguns campos podem estar com nomes diferentes
- **Verificar:** Mapeamento correto no envio

---

### 4. **Integração com API - Status Atual**

#### Telas com chamadas API mockadas:
- ✅ `LoginCliente.jsx` - Mock interno (credenciais 1234@gmail.com/1234)
- ✅ `CadastroCliente.jsx` - Chama `clienteService.cadastrar()` mas não testado
- ✅ `LoginRestaurante.jsx` - Mock interno
- ✅ `EntrarNaFila.jsx` - Mock interno
- ✅ `AcompanharFila.jsx` - Mock interno
- ✅ `RestaurantesDisponiveis.jsx` - Mock interno
- ✅ `PainelOperador.jsx` - Mock interno
- ✅ Todas as 5 novas telas - Mock interno

**Nenhuma tela está integrada com backend real ainda.**

---

### 5. **Campo `tipoFila` vs `prioridade`**

#### EntrarNaFila.jsx
- **Frontend usa:** `tipoFila` internamente mas envia como `prioridade`
- **Backend espera:** `prioridade` (NORMAL, FAST_LANE, VIP)
- **Status:** ✅ OK (mapeamento correto no envio)

---

### 6. **WebSocket - Não Implementado**

#### Funcionalidades que dependem de WebSocket:
- ❌ `PainelOperador.jsx` - Atualizações em tempo real da fila
- ❌ `AcompanharFila.jsx` - Notificação quando ticket é chamado
- ❌ `PainelPublico.jsx` - Display de tickets chamados

**Status:** Sistema usa polling mas deveria usar WebSocket conforme documentação backend.

---

### 7. **Endpoint Faltante - Listar Tickets Chamados**

#### PainelPublico.jsx
- **Necessário:** Endpoint para listar últimos tickets chamados (não apenas um específico)
- **Backend documenta:** Apenas `GET /tickets/publico/{ticketId}` (busca individual)
- **Frontend precisa:** Lista de tickets com status `CHAMADO` para exibir no painel

**Ação necessária:** Backend criar endpoint `GET /tickets/publico/restaurante/{slug}/chamados`

---

### 8. **Role-Based Access Control (RBAC)**

#### Controle de Acesso:
- ✅ `ConfiguracoesRestaurante` - Apenas via Painel Administrativo (correto)
- ⚠️ Falta verificação de role (`ADMIN` vs `OPERADOR`) no frontend
- ⚠️ Falta proteção de rotas baseada em role

**Ação necessária:** Implementar Context/Provider para autenticação com verificação de roles.

---

### 9. **Campos que Existem no Backend mas não no Frontend**

#### Entidade Cliente (backend):
- `vipDesde` (date) - Frontend não exibe
- `totalVip` - Frontend não exibe

#### Entidade Ticket (backend):
- `chamadasCount` - Frontend não exibe
- `contagemRechamada` - Frontend não exibe
- Timestamps: `criadoEm`, `atualizadoEm`, `chamadoEm`, `finalizadoEm`, `canceladoEm` - Alguns não exibidos

**Sugestão:** Adicionar esses campos nas telas de detalhes quando útil.

---

### 10. **Validações Ausentes**

#### Frontend não valida:
- ❌ CPF válido (CadastroCliente)
- ❌ CNPJ válido (CadastroRestaurante)
- ❌ Email válido
- ❌ Telefone válido (formato)
- ❌ Senha forte (mínimo de caracteres)
- ❌ CEP válido

**Ação necessária:** Implementar validações com Zod ou outra biblioteca.

---

## 📊 RESUMO GERAL (ATUALIZADO)

## 📊 RESUMO GERAL (ATUALIZADO)

### Por Componente:
- ✅ **Completas (UI):** 7 (EscolhaPerfil, PainelAdministrativo, HistoricoTickets, DetalhesTicket, PainelPublico, ConfiguracoesRestaurante, HistoricoClienteTickets)
- ⚠️ **Incompletas (aguardam integração):** 11 telas existentes
- ❌ **Faltando:** 0 telas principais

### Por Funcionalidade:
- **Autenticação:** 40% implementado (estrutura ok, falta integração e campo restauranteSlug)
- **Cliente - Entrar na Fila:** 70% implementado (UI ok, falta API)
- **Cliente - Acompanhar Ticket:** 70% implementado (UI ok, falta API + WebSocket)
- **Operador - Gerenciar Fila:** 70% implementado (UI ok, falta API + WebSocket)
- **Admin - Onboarding:** 60% implementado (UI ok, falta ajustes de campos)
- **Painel Público:** 90% implementado (UI completa, falta API + WebSocket)
- **Históricos:** 90% implementado (UI completa, falta apenas integração)
- **Configurações:** 90% implementado (UI completa, falta apenas integração)

### Integração com Backend:
- 📦 **API Service Layer:** ✅ Criado e completo (`src/services/api.js`)
- 🔌 **Integração Real:** ❌ Nenhuma tela conectada ao backend ainda
- 🧪 **Mock Data:** ✅ Todas as telas funcionam com dados mockados
- 🔄 **WebSocket:** ❌ Não implementado

---

## 🚨 PRIORIDADES CRÍTICAS (ATUALIZADAS)

### 🔴 Alta Prioridade (Bloqueante):
1. **Resolver problema de `restauranteSlug` na autenticação** ⚠️ CRÍTICO
   - Definir arquitetura multi-tenant correta
   - Cliente precisa ou não de slug no login?
   
2. **Padronizar nomenclatura de campos** ⚠️ CRÍTICO
   - `precoFastlane` vs `precoFastLane`
   - `maxReentradasPorDia` vs `limiteTicketsPorCliente`

3. **Integrar autenticação real**
   - LoginCliente com backend
   - LoginRestaurante com backend
   - Salvar tokens e dados corretamente

4. **WebSocket para PainelOperador e AcompanharFila**
   - Atualizações em tempo real
   - Notificações de chamadas

### 🟡 Média Prioridade:
5. **Completar integrações de API**
   - EntrarNaFila → backend
   - AcompanharFila → backend
   - RestaurantesDisponiveis → backend
   - PainelOperador → todos os endpoints

6. **Backend: Criar endpoint para painel público**
   - `GET /tickets/publico/restaurante/{slug}/chamados`
   - Retornar últimos tickets chamados

7. **Implementar validações com Zod**
   - CPF, CNPJ, email, telefone, senha

### 🟢 Baixa Prioridade:
8. CRUD de filas (backend não documentado)
9. Gestão de equipe completa (backend não documentado)
10. Exibir campos adicionais (vipDesde, chamadasCount, etc.)

---

## ✅ CHECKLIST DE INTEGRAÇÃO

### Fase 1 - Correções de Nomenclatura
- [ ] Mapear `precoFastlane` ↔ `precoFastLane` na camada de serviços
- [ ] Decidir: `maxReentradasPorDia` ou `limiteTicketsPorCliente`
- [ ] Criar função de mapeamento de campos backend → frontend
- [ ] Testar com backend real

### Fase 2 - Autenticação
- [ ] Resolver arquitetura multi-tenant (restauranteSlug)
- [ ] Integrar LoginCliente com `/auth/cliente/login`
- [ ] Integrar LoginRestaurante com `/auth/login`
- [ ] Implementar Context de Autenticação
- [ ] Proteger rotas com autenticação
- [ ] Implementar verificação de roles (ADMIN/OPERADOR)

### Fase 3 - Cliente (App)
- [ ] Integrar CadastroCliente com `/auth/cliente/cadastro`
- [ ] Integrar RestaurantesDisponiveis com `/cliente/restaurantes/proximos`
- [ ] Integrar EntrarNaFila com `/cliente/restaurantes/{slug}/fila/entrar`
- [ ] Integrar AcompanharFila com `/cliente/meu-ticket`
- [ ] Implementar polling em AcompanharFila
- [ ] Integrar PerfilCliente com `/cliente/perfil`
- [ ] Integrar HistoricoClienteTickets com `/cliente/meu-ticket`

### Fase 4 - Operador
- [ ] Integrar PainelOperador com `/tickets/filas/{filaId}/tickets/ativa`
- [ ] Implementar todas as ações do operador:
  - [ ] Chamar cliente
  - [ ] Finalizar atendimento
  - [ ] Rechamar
  - [ ] Pular
  - [ ] Marcar No-Show
  - [ ] Cancelar ticket
- [ ] Integrar HistoricoTickets com `/tickets/filas/{filaId}/tickets/historico`
- [ ] Integrar DetalhesTicket com `/tickets/{ticketId}`
- [ ] Adicionar modal para criar ticket presencial

### Fase 5 - Admin
- [ ] Integrar CadastroRestaurante com `/restaurantes/cadastro`
- [ ] Integrar ConfiguracoesRestaurante com `/restaurantes/meu-restaurante`
- [ ] Implementar update de configurações (PATCH)

### Fase 6 - WebSocket
- [ ] Configurar conexão WebSocket
- [ ] PainelOperador: receber atualizações de fila
- [ ] AcompanharFila: receber notificação de chamada
- [ ] PainelPublico: atualizar tickets chamados em tempo real

### Fase 7 - Painel Público
- [ ] **Backend:** Criar endpoint para listar tickets chamados
- [ ] Integrar PainelPublico com novo endpoint
- [ ] Implementar WebSocket para atualizações

### Fase 8 - Validações e Polimento
- [ ] Adicionar validações Zod em todos os formulários
- [ ] Implementar máscaras de input (CPF, CNPJ, telefone, CEP)
- [ ] Tratamento de erros global
- [ ] Loading states em todas as requisições
- [ ] Mensagens de sucesso/erro com toast
- [ ] Testes de responsividade

---

## 🔧 RECOMENDAÇÕES TÉCNICAS (ATUALIZADAS)

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
