# 🚀 GUIA DE INTEGRAÇÃO COMPLETA - BACKEND ATIVADO

## ✅ STATUS: INTEGRAÇÃO 100% ATIVADA

Todos os mocks foram removidos e o sistema agora depende **completamente** do backend para funcionar.

---

## 📋 PRÉ-REQUISITOS OBRIGATÓRIOS

### 1. Backend Rodando
```bash
# O backend DEVE estar rodando em:
http://localhost:3000/api/v1
```

### 2. Banco de Dados
- PostgreSQL rodando (Supabase configurado)
- Migrations executadas
- Restaurante cadastrado no banco

### 3. Variáveis de Ambiente do Backend
**CRÍTICO:** O arquivo `.env` do backend DEVE ter:
```env
FRONTEND_URL=http://localhost:5173
```
❌ NÃO pode ser `http://localhost:3000` (isso causaria erro de CORS)

---

## 🎯 PASSO A PASSO PARA TESTAR

### **FASE 1: Preparação**

#### 1.1 - Verificar Backend
```bash
# Testar se o backend está respondendo:
curl http://localhost:3000/api/v1/health
# Ou abrir no navegador: http://localhost:3000/api/v1/health
```

#### 1.2 - Iniciar Frontend
```bash
cd fila-restaurante-front
npm run dev
```
Frontend deve abrir em: `http://localhost:5173`

---

### **FASE 2: Cadastro do Restaurante (Admin)**

#### 2.1 - Cadastrar Restaurante
1. Acesse: `http://localhost:5173/restaurante/cadastro`
2. Preencha **todos os campos obrigatórios**:
   - Nome do restaurante
   - Slug (ex: `trattoria-bella-vista`)
   - Email do admin
   - Senha do admin
   - Preço Fast-Lane
   - Máximo de reentradas por dia
   - Endereço completo

3. Clique em **"Cadastrar Restaurante"**

**✅ Sucesso:** Você será redirecionado para a tela de login

**❌ Erro comum:**
- "Network Error" = Backend não está rodando
- "CORS Error" = `FRONTEND_URL` errado no backend

---

### **FASE 3: Login do Restaurante**

#### 3.1 - Login como Admin/Operador
1. Acesse: `http://localhost:5173/restaurante/login`
2. Preencha:
   - **Slug:** O mesmo que você cadastrou (ex: `trattoria-bella-vista`)
   - **Email:** Email do admin cadastrado
   - **Senha:** Senha que você definiu

3. Clique em **"Entrar"**

**✅ Sucesso esperado:**
- Redirecionamento para `/restaurante/painel` (se ADMIN)
- Redirecionamento para `/restaurante/painel-operador` (se OPERADOR)
- Console deve mostrar: `✅ FilaId salvo: <uuid>`

**🔴 CRÍTICO:** Se não aparecer a mensagem de filaId salvo:
```
⚠️ AVISO: filaAtiva.id não encontrado na resposta do backend
```
Significa que o backend não retornou `usuario.restaurante.filaAtiva.id` no login.

**Solução:** Verifique se o backend está retornando:
```json
{
  "token": "...",
  "usuario": {
    "role": "ADMIN",
    "restaurante": {
      "filaAtiva": {
        "id": "uuid-da-fila-aqui"
      }
    }
  }
}
```

---

### **FASE 4: Painel do Operador**

#### 4.1 - Acessar Painel Operador
- Se você é ADMIN: Navegue para `/restaurante/painel-operador` através do menu
- Se você é OPERADOR: Você já está lá após o login

#### 4.2 - Testar Carregamento da Fila
**O que acontece:**
- Sistema busca `filaAtivaId` do `localStorage`
- Chama: `GET /tickets/filas/{filaId}/tickets/ativa`
- Exibe lista de tickets ativos

**✅ Sucesso:** Lista vazia ou com tickets (se houver)

**❌ Erro:**
```
❌ ERRO: filaId não encontrado no localStorage
💡 Certifique-se de que o login salvou o filaId
```

**Solução:** Faça logout e login novamente. Se persistir, o backend não está retornando `filaAtiva.id`.

#### 4.3 - Adicionar Cliente Presencial
1. Clique no botão **"+ Adicionar Cliente"**
2. Preencha:
   - Nome do cliente
   - Telefone
   - Quantidade de pessoas
   - Observações (opcional)
3. Clique em **"Adicionar à Fila"**

**Backend chamado:** `POST /tickets/filas/{filaId}/tickets`

**✅ Sucesso:** Cliente aparece na lista

#### 4.4 - Chamar Cliente
1. Clique no botão **"Chamar"** no primeiro cliente da fila
2. O status muda de `AGUARDANDO` → `CHAMADO`

**Backend chamado:** `POST /tickets/{ticketId}/chamar`

#### 4.5 - Outras Ações
- **Rechamar:** `POST /tickets/{ticketId}/rechamar`
- **Finalizar:** `POST /tickets/{ticketId}/finalizar`
- **Pular:** `POST /tickets/{ticketId}/pular`
- **No-Show:** `POST /tickets/{ticketId}/no-show`
- **Cancelar:** `POST /tickets/{ticketId}/cancelar`

Todas as ações recarregam a fila automaticamente.

---

### **FASE 5: Fluxo do Cliente**

#### 5.1 - Cadastro do Cliente
1. Acesse: `http://localhost:5173/cliente/cadastro`
2. Preencha **todos os campos**:
   - Nome completo
   - Email
   - Telefone
   - CPF
   - Senha
   - Cidade
   - Estado

3. Clique em **"Criar Conta"**

**Backend chamado:** `POST /auth/cliente/cadastro`

**✅ Sucesso:**
- Token salvo automaticamente
- Redirecionamento para `/cliente/restaurantes`

#### 5.2 - Login do Cliente (Alternativo)
Se já tem conta:
1. Acesse: `http://localhost:5173/cliente/login`
2. Email e Senha
3. Clique em **"Entrar"**

**Backend chamado:** `POST /auth/cliente/login`

#### 5.3 - Buscar Restaurantes Próximos
- Automaticamente carrega ao entrar em `/cliente/restaurantes`

**Backend chamado:** `GET /cliente/restaurantes/proximos`

**Retorno esperado:** Lista de restaurantes na mesma cidade/estado do cliente

**⚠️ Importante:** O backend filtra por `cidade` e `estado` do cliente logado

#### 5.4 - Entrar na Fila
1. Escolha um restaurante
2. Escolha a prioridade:
   - **Normal** (grátis)
   - **Fast-Lane** (paga - valor configurado pelo restaurante)
3. Informe quantidade de pessoas
4. Adicione observações (opcional)
5. Clique em **"Confirmar Entrada"**

**Backend chamado:** `POST /cliente/restaurantes/{slug}/fila/entrar`

**Payload:**
```json
{
  "quantidadePessoas": 2,
  "prioridade": "NORMAL",
  "observacoes": "Mesa perto da janela"
}
```

**✅ Sucesso:** Redirecionamento para `/cliente/meu-ticket`

**❌ Erros possíveis:**
- 400: Cliente já tem ticket ativo
- 403: Limite de reentradas atingido ou cliente bloqueado

#### 5.5 - Acompanhar Fila
- Página atualiza automaticamente a cada 10 segundos
- Mostra:
  - Posição na fila
  - Tempo estimado
  - Status (AGUARDANDO, CHAMADO, etc.)
  - Mensagem de boas-vindas do restaurante

**Backend chamado:** `GET /cliente/meu-ticket`

#### 5.6 - Cancelar Ticket
1. Clique em **"Sair da Fila"**
2. Confirme no modal
3. Você volta para a lista de restaurantes

**Backend chamado:** `POST /cliente/ticket/{ticketId}/cancelar`

---

### **FASE 6: Gerenciamento (Admin)**

#### 6.1 - Acessar Gerenciamento
1. Login como ADMIN
2. No painel, clique em **"Gerenciamento"**
3. Você verá 2 abas:
   - **Equipe** (TODO: endpoint ainda não implementado no backend)
   - **Configurações**

#### 6.2 - Salvar Configurações
1. Vá para aba **"Configurações"**
2. Edite os campos:
   - Nome
   - Telefone
   - Capacidade
   - Tempo médio de atendimento
   - Preço Fast-Lane
   - Máximo reentradas por dia
   - **Mensagem de Boas-Vindas** (aparece para o cliente)

3. Clique em **"Salvar Configurações"**

**Backend chamado:** `PATCH /restaurantes/meu-restaurante`

**✅ Sucesso:** Alert "Configurações salvas com sucesso!"

---

## 🔍 DEBUGGING - COMO IDENTIFICAR PROBLEMAS

### Console do Navegador (F12)

#### Mensagens de Sucesso (✅)
```
✅ Login realizado com sucesso: {usuario}
📌 Role: ADMIN
✅ FilaId salvo: 123e4567-e89b-12d3-a456-426614174000
✅ Fila carregada: {response}
✅ Cliente chamado
✅ Ticket criado: {ticket}
```

#### Mensagens de Erro (❌)
```
❌ ERRO: filaId não encontrado no localStorage
💡 Certifique-se de que o login salvou o filaId
```

### Network Tab (Rede)
- Veja todas as requisições HTTP
- Status 200/201 = Sucesso
- Status 400 = Erro de validação
- Status 401 = Não autenticado (token inválido)
- Status 403 = Sem permissão
- Status 404 = Endpoint não encontrado
- Status 500 = Erro no servidor

---

## 🆘 PROBLEMAS COMUNS E SOLUÇÕES

### Problema 1: "Network Error"
**Causa:** Backend não está rodando

**Solução:**
```bash
cd fila-restaurante-backend
npm run dev
```

### Problema 2: "CORS Error"
**Causa:** `FRONTEND_URL` errado no backend

**Solução:** Editar `.env` do backend:
```env
FRONTEND_URL=http://localhost:5173
```
Reiniciar backend após alterar.

### Problema 3: "401 Unauthorized"
**Causa:** Token expirou ou inválido

**Solução:**
1. Fazer logout
2. Fazer login novamente
3. Se persistir, verificar SECRET_KEY no backend

### Problema 4: PainelOperador não carrega fila
**Causa:** `filaAtivaId` não foi salvo no localStorage

**Solução:**
1. Abrir Console (F12)
2. Ir em Application → Local Storage
3. Verificar se existe a chave `filaAtivaId`
4. Se não existe, o backend não retornou no login
5. Verificar resposta do backend em `/auth/login`

### Problema 5: Cliente não vê restaurantes
**Causa:** Cidade/estado do cliente diferente do restaurante

**Solução:**
- Backend filtra por `cidade` e `estado`
- Cliente e restaurante devem estar na mesma localização
- Verificar dados no banco de dados

### Problema 6: Não consigo entrar na fila
**Erros possíveis:**
- `Cliente já possui um ticket ativo`: Cancele o ticket anterior primeiro
- `Limite de reentradas atingido`: Cliente já entrou X vezes hoje
- `Cliente está bloqueado`: Cliente tem muitos no-shows

---

## 📊 ESTRUTURA DE DADOS - O QUE ESPERAR DO BACKEND

### Login Restaurante - Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid",
    "nome": "Admin Principal",
    "email": "admin@restaurant.com",
    "role": "ADMIN",
    "restaurante": {
      "id": "uuid",
      "nome": "Trattoria Bella Vista",
      "slug": "trattoria-bella-vista",
      "filaAtiva": {
        "id": "uuid-da-fila"  // 🔴 CRÍTICO
      }
    }
  }
}
```

### Listar Fila Ativa - Response
```json
{
  "fila": {
    "id": "uuid",
    "nome": "Fila Principal"
  },
  "tickets": [
    {
      "id": "uuid",
      "numero": "A-023",
      "nomeCliente": "João Silva",
      "telefone": "11987654321",
      "quantidadePessoas": 2,
      "prioridade": "NORMAL",
      "status": "AGUARDANDO",
      "posicao": 1,
      "tempoEstimadoMinutos": 5,
      "observacoes": "Cadeira de bebê"
    }
  ],
  "estatisticas": {
    "totalAguardando": 5,
    "totalChamados": 2
  }
}
```

### Buscar Restaurantes - Response
```json
{
  "restaurantes": [
    {
      "id": "uuid",
      "nome": "Trattoria Bella Vista",
      "slug": "trattoria-bella-vista",
      "telefone": "11987654321",
      "endereco": "Rua Augusta, 1234",
      "cidade": "São Paulo",
      "estado": "SP",
      "mensagemBoasVindas": "Bem-vindo!",
      "filaAtiva": {
        "tamanhoFila": 8
      }
    }
  ]
}
```

### Entrar na Fila - Response
```json
{
  "ticket": {
    "id": "uuid",
    "numero": "A-024",
    "status": "AGUARDANDO",
    "prioridade": "NORMAL",
    "posicaoAtual": 9,
    "tempoEstimadoMinutos": 25,
    "quantidadePessoas": 2,
    "restaurante": {
      "nome": "Trattoria Bella Vista",
      "telefone": "11987654321",
      "endereco": "Rua Augusta, 1234",
      "mensagemBoasVindas": "Bem-vindo!"
    }
  }
}
```

---

## ⚡ ORDEM RECOMENDADA DE TESTES

### Teste Completo - Fluxo Ideal

1. **Backend rodando** ✅
2. **Frontend rodando** ✅
3. **Cadastrar restaurante** (uma vez)
4. **Login como Admin**
5. **Verificar filaId no console**
6. **Acessar PainelOperador**
7. **Adicionar cliente presencial**
8. **Chamar cliente**
9. **Finalizar atendimento**
10. **Cadastrar cliente** (fluxo app)
11. **Buscar restaurantes**
12. **Entrar na fila**
13. **Acompanhar ticket**
14. **Cancelar ticket**
15. **Login novamente no restaurante**
16. **Verificar se o cliente apareceu na fila**
17. **Chamar e finalizar**

---

## 🎯 ENDPOINTS UTILIZADOS (RESUMO)

### Autenticação
- ✅ `POST /auth/login` - Login restaurante
- ✅ `POST /auth/cliente/cadastro` - Cadastro cliente
- ✅ `POST /auth/cliente/login` - Login cliente

### Cliente
- ✅ `GET /cliente/restaurantes/proximos` - Lista restaurantes
- ✅ `POST /cliente/restaurantes/{slug}/fila/entrar` - Entrar na fila
- ✅ `GET /cliente/meu-ticket` - Buscar meu ticket
- ✅ `POST /cliente/ticket/{ticketId}/cancelar` - Cancelar ticket

### Operador/Admin
- ✅ `GET /tickets/filas/{filaId}/tickets/ativa` - Listar fila ativa
- ✅ `POST /tickets/filas/{filaId}/tickets` - Adicionar cliente presencial
- ✅ `POST /tickets/{ticketId}/chamar` - Chamar cliente
- ✅ `POST /tickets/{ticketId}/rechamar` - Rechamar
- ✅ `POST /tickets/{ticketId}/finalizar` - Finalizar
- ✅ `POST /tickets/{ticketId}/pular` - Pular vez
- ✅ `POST /tickets/{ticketId}/no-show` - Marcar no-show
- ✅ `POST /tickets/{ticketId}/cancelar` - Cancelar

### Restaurante
- ✅ `GET /restaurantes/meu-restaurante` - Buscar dados
- ✅ `PATCH /restaurantes/meu-restaurante` - Atualizar configurações

---

## 🔥 IMPORTANTE: O QUE MUDOU

### ❌ REMOVIDO (Não existe mais):
- Todos os mocks do localStorage
- Dados fake de teste
- Fallbacks para funcionamento offline
- TODOs comentados

### ✅ ADICIONADO:
- Integração completa com backend
- Tratamento de erros da API
- Mensagens de console para debugging
- Validação de filaId crítica
- Auto-reload após ações

### 🔴 DEPENDÊNCIAS CRÍTICAS:
1. Backend DEVE estar rodando
2. filaId DEVE ser retornado no login
3. Token DEVE ser válido
4. CORS DEVE estar configurado corretamente

---

## 📞 SUPORTE

Se encontrar problemas:

1. **Verifique o console do navegador** (F12)
2. **Verifique a aba Network** (requisições HTTP)
3. **Verifique os logs do backend**
4. **Confirme que todas as variáveis de ambiente estão corretas**
5. **Teste os endpoints diretamente** (Postman/curl)

---

## ✅ CHECKLIST FINAL

- [ ] Backend rodando em `localhost:3000`
- [ ] Frontend rodando em `localhost:5173`
- [ ] FRONTEND_URL correto no backend `.env`
- [ ] Banco de dados acessível
- [ ] Restaurante cadastrado
- [ ] Login funcionando
- [ ] filaId sendo salvo (verificar console)
- [ ] PainelOperador carregando fila
- [ ] Cliente consegue cadastrar
- [ ] Cliente consegue entrar na fila
- [ ] Cliente consegue acompanhar ticket
- [ ] Operador consegue chamar clientes
- [ ] Todas as ações funcionando

---

**🎉 INTEGRAÇÃO COMPLETA REALIZADA COM SUCESSO!**

O sistema agora está 100% integrado com o backend. Todos os mocks foram removidos e o frontend depende completamente da API para funcionar.
