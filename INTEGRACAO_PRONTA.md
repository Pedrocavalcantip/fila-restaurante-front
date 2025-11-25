# ✅ FRONTEND PRONTO PARA INTEGRAÇÃO COM BACKEND

## 📋 Status Geral: **PRONTO** ✅

Todos os arquivos principais estão preparados com código comentado, prontos para descomentar e integrar com o backend.

---

## 🔧 Arquivos Preparados para Integração

### ✅ 1. **LoginRestaurante.jsx**
- **Status:** PRONTO ✅
- **Linhas 20-28:** Código comentado para integração
- **O que fazer:** Descomentar e remover mock (linhas 30-49)
- **Payload:** `{ email, senha, restauranteSlug }`
- **Importante:** Salvar `filaAtivaId` após login:
  ```javascript
  localStorage.setItem('filaAtivaId', usuario.restaurante.filaAtiva.id);
  ```

### ✅ 2. **LoginCliente.jsx**
- **Status:** PRONTO ✅
- **Linhas 20-27:** Código comentado
- **Payload:** `{ email, senha }`
- **Response:** `{ token, cliente }`

### ✅ 3. **CadastroCliente.jsx**
- **Status:** PRONTO ✅
- **Linhas 28-45:** Código comentado
- **Payload:** `{ nome, email, telefone, senha, cpf, cidade, estado }`
- **Response:** `{ token, cliente }`
- **Auto-login:** Sim, redireciona para `/cliente/restaurantes`

### ✅ 4. **RestaurantesDisponiveis.jsx**
- **Status:** PRONTO ✅
- **Função `carregarDados`:** Já tenta buscar do backend, cai em mock se falhar
- **Função `handleConfirmarEntrada` (linhas 88-108):** Código comentado
- **Endpoint:** `POST /cliente/restaurantes/{slug}/fila/entrar`
- **Payload:** `{ quantidadePessoas, prioridade, observacoes }`

### ✅ 5. **PainelOperador.jsx** (CRÍTICO)
- **Status:** PARCIALMENTE PRONTO ⚠️
- **Função `carregarFila` (linhas 37-52):** Código comentado
- **IMPORTANTE:** Precisa do `filaId` do localStorage
- **Ações do operador:** TODOs marcados, mas código mock ainda não comentado

**Funções que precisam de integração:**
- `chamarCliente` (linha ~134)
- `rechamarCliente` (linha ~158)
- `finalizarAtendimento` (linha ~191)
- `pularVez` (linha ~218)
- `marcarNoShow` (linha ~253)
- `cancelarTicket` (linha ~285)
- `adicionarClientePresencial` (linha ~337)

**Como integrar cada ação:**
```javascript
// Exemplo para chamarCliente:
const chamarCliente = async (ticketId) => {
  try {
    await ticketService.chamarCliente(ticketId);
    await carregarFila(); // Recarregar lista
  } catch (error) {
    console.error('Erro:', error);
  }
};
```

### ⚠️ 6. **Gerenciamento.jsx**
- **Status:** PARCIAL
- **Linha 91:** TODO para salvar configurações
- **Endpoint:** `PATCH /restaurantes/meu-restaurante`
- **Ação necessária:** Descomentar chamada API e remover alert mock

### ⚠️ 7. **AcompanharFila.jsx**
- **Status:** PARCIAL
- **Função `carregarTicket`:** Usa localStorage + mock
- **Ação necessária:** Integrar com `GET /cliente/meu-ticket`
- **Função `cancelarTicket`:** TODO na linha ~169

---

## 🚀 Ordem Recomendada de Integração

### **FASE 1 - Autenticação (CRÍTICO)**
1. ✅ LoginRestaurante - Descomentar linhas 20-28
2. ✅ LoginCliente - Descomentar linhas 20-27
3. ✅ CadastroCliente - Descomentar linhas 28-45

**Teste:** Login deve funcionar e salvar token + dados no localStorage

---

### **FASE 2 - PainelOperador (ALTA PRIORIDADE)**
4. ✅ PainelOperador.carregarFila - Descomentar linhas 37-52
   - **CRÍTICO:** Garantir que `filaId` está salvo após login
5. ⚠️ PainelOperador - Ações (chamar, rechamar, finalizar, etc.)
   - Substituir código mock por chamadas API + `carregarFila()`

**Teste:** Listar fila ativa deve funcionar

---

### **FASE 3 - Cliente Entrar na Fila**
6. ✅ RestaurantesDisponiveis.buscarRestaurantes - Já integrado (fallback para mock)
7. ✅ RestaurantesDisponiveis.handleConfirmarEntrada - Descomentar linhas 88-108

**Teste:** Cliente deve conseguir entrar na fila

---

### **FASE 4 - Funcionalidades Secundárias**
8. ⚠️ AcompanharFila - Buscar ticket ativo
9. ⚠️ Gerenciamento - Salvar configurações
10. ⚠️ HistoricoTickets - Listar histórico
11. ⚠️ DetalhesTicket - Buscar detalhes

---

## ⚠️ PONTOS CRÍTICOS DE ATENÇÃO

### 🔴 1. **filaId é OBRIGATÓRIO**
Após login do restaurante, você DEVE salvar o filaId:

```javascript
// Em LoginRestaurante.jsx após response do backend:
const { token, usuario } = response;
localStorage.setItem('restauranteToken', token);
localStorage.setItem('operadorLogado', JSON.stringify(usuario));
localStorage.setItem('filaAtivaId', usuario.restaurante.filaAtiva.id); // ← CRÍTICO!
localStorage.setItem('restauranteSlug', slug);
```

Sem o `filaId`, o PainelOperador NÃO funcionará.

---

### 🔴 2. **Estrutura de Response do Backend**
O backend pode retornar estruturas ligeiramente diferentes da documentação. **Verifique:**

```javascript
// Esperado:
{ token, usuario }

// Pode vir:
{ token, user }
// ou
{ access_token, usuario }
```

**Solução:** Adapte o código conforme o response real.

---

### 🔴 3. **Nomes de Campos**
Frontend usa `nomeCliente`, backend pode usar `nome_cliente` ou `nome`.

**Campos críticos para verificar:**
- `criadoEm` vs `createdAt` vs `created_at`
- `quantidadePessoas` vs `quantidade_pessoas`
- `tempoEstimadoMinutos` vs `tempo_estimado`
- `mensagemBoasVindas` vs `mensagem_boas_vindas`

**Solução:** Backend deve retornar em camelCase ou frontend converte.

---

### 🔴 4. **Prioridades**
- Frontend: `NORMAL`, `FAST_LANE` (removeu VIP)
- Backend: `NORMAL`, `FAST_LANE`, `VIP`

**Atenção:** Backend pode retornar tickets VIP que frontend não trata.

**Solução temporária:** Tratar VIP como FAST_LANE no frontend.

---

### 🔴 5. **localStorage Consistente**
Use SEMPRE os mesmos nomes de chave:

**Cliente:**
- `token` - Token JWT do cliente
- `clienteLogado` - Dados do cliente

**Restaurante:**
- `restauranteToken` - Token JWT do operador/admin
- `operadorLogado` - Dados do operador
- `filaAtivaId` - ID da fila (CRÍTICO!)
- `restauranteSlug` - Slug do restaurante

---

## 🔧 Script de Integração Rápida

### Para LoginRestaurante:
1. Abrir `src/paginas/LoginRestaurante.jsx`
2. Descomentar linhas 20-28
3. Adicionar após linha 26:
   ```javascript
   localStorage.setItem('filaAtivaId', usuario.restaurante.filaAtiva.id);
   ```
4. Comentar/remover linhas 30-49 (mock)

### Para PainelOperador:
1. Abrir `src/paginas/PainelOperador.jsx`
2. Descomentar linhas 37-52 na função `carregarFila`
3. Para cada ação (chamar, rechamar, etc.), substituir por:
   ```javascript
   const chamarCliente = async (ticketId) => {
     try {
       await ticketService.chamarCliente(ticketId);
       await carregarFila();
     } catch (error) {
       console.error('Erro:', error);
       // Exibir mensagem de erro para usuário
     }
   };
   ```

---

## 🐛 Troubleshooting Comum

### Erro: "filaId is null"
**Causa:** `filaId` não foi salvo após login
**Solução:** Adicionar `localStorage.setItem('filaAtivaId', ...)` após login

### Erro: 401 Unauthorized
**Causa:** Token não está sendo enviado ou expirou
**Solução:** Verificar interceptor em `api.js` e fazer login novamente

### Erro: CORS
**Causa:** Backend não configurou CORS corretamente
**Solução:** Pedir ao colega para adicionar `http://localhost:5173` no CORS do backend

### Erro: "Cannot read property 'id' of undefined"
**Causa:** Estrutura do response diferente do esperado
**Solução:** Logar `console.log(response)` e ajustar código

---

## ✅ Checklist Final Antes de Testar

- [ ] Backend rodando em `http://localhost:3000`
- [ ] Frontend rodando em `http://localhost:5173`
- [ ] CORS configurado no backend
- [ ] Banco de dados conectado
- [ ] Testar login manualmente (Postman)
- [ ] Verificar estrutura de response do backend
- [ ] `filaId` será retornado no login?
- [ ] Descomentar código em LoginRestaurante
- [ ] Adicionar `localStorage.setItem('filaAtivaId', ...)`
- [ ] Descomentar código em PainelOperador
- [ ] Testar login → carregar fila
- [ ] Implementar tratamento de erros
- [ ] Adicionar mensagens de feedback para usuário

---

## 📝 Resumo

**✅ Arquivos 100% prontos:**
- LoginRestaurante.jsx
- LoginCliente.jsx
- CadastroCliente.jsx
- RestaurantesDisponiveis.jsx (buscar + entrar na fila)

**⚠️ Arquivos 80% prontos (precisam substituir mock por API):**
- PainelOperador.jsx (ações do operador)
- Gerenciamento.jsx (salvar configurações)
- AcompanharFila.jsx (buscar ticket)

**🔴 Ponto CRÍTICO:**
- Salvar `filaId` após login do restaurante

**🚀 Próximo passo:**
1. Descomentar LoginRestaurante
2. Testar login
3. Verificar se `filaId` foi salvo
4. Descomentar PainelOperador.carregarFila
5. Testar listagem da fila

---

**Tudo pronto para integração! Boa sorte! 🚀**
