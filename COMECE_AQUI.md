# 🚀 COMECE AQUI - PRIMEIROS PASSOS

## ⚡ INÍCIO RÁPIDO (5 minutos)

### PRÉ-REQUISITO: Backend Rodando

**ANTES DE TUDO, verifique:**

```bash
# 1. Navegue até o backend
cd ../fila-restaurante-backend  # ou caminho correto

# 2. Verifique se está instalado
npm install

# 3. Inicie o backend
npm run dev

# 4. Teste se está funcionando
# Abra: http://localhost:3000/api/v1/health
# Deve retornar: { "status": "ok" }
```

✅ **Backend deve estar em:** `http://localhost:3000/api/v1`

---

## 🔧 CONFIGURAÇÃO CRÍTICA DO BACKEND

**Abra o arquivo `.env` do BACKEND e verifique:**

```env
FRONTEND_URL=http://localhost:3001
```

❌ **NÃO** pode ser `http://localhost:3000`  
❌ **NÃO** pode estar comentado  
❌ **NÃO** pode estar faltando

Se você mudar isso, **reinicie o backend**.

---

## 🎯 INICIAR FRONTEND

```bash
# 1. Certifique-se de estar na pasta do frontend
cd fila-restaurante-front

# 2. Instalar dependências (se ainda não fez)
npm install

# 3. Iniciar servidor de desenvolvimento
npm run dev
```

Frontend abre automaticamente em: `http://localhost:3001`

---

## 🧪 TESTE 1: Cadastrar Restaurante

### Passo 1: Acesse
```
http://localhost:3001/restaurante/cadastro
```

### Passo 2: Preencha TODOS os campos
- Nome: `Trattoria Bella Vista`
- Slug: `trattoria-bella-vista` (sem espaços, minúsculas)
- Email Admin: `admin@restaurant.com`
- Senha Admin: `admin123`
- Telefone: `11987654321`
- CEP: `01310-100`
- Rua: `Av. Paulista`
- Número: `1000`
- Bairro: `Bela Vista`
- Cidade: `São Paulo`
- Estado: `SP`
- Preço Fast-Lane: `15.00`
- Max Reentradas: `3`

### Passo 3: Clique em "Cadastrar Restaurante"

**✅ Sucesso:** Você será redirecionado para a tela de login

**❌ Erro:** Veja a seção de problemas abaixo

---

## 🧪 TESTE 2: Login como Admin

### Passo 1: Na tela de login, preencha:
- **Slug:** `trattoria-bella-vista` (o que você cadastrou)
- **Email:** `admin@restaurant.com`
- **Senha:** `admin123`

### Passo 2: Clique em "Entrar"

### Passo 3: Abra o Console (F12)
**Deve aparecer:**
```
✅ Login realizado com sucesso: {usuario}
📌 Role: ADMIN
✅ FilaId salvo: <algum-uuid>
```

**🔴 CRÍTICO:** Se NÃO aparecer "FilaId salvo", há um problema!

---

## 🧪 TESTE 3: Adicionar Cliente na Fila

### Passo 1: Você já está no Painel Administrativo
- Clique em **"Painel Operador"**

### Passo 2: Adicionar Cliente Presencial
- Clique no botão **"+ Adicionar Cliente"**
- Preencha:
  - Nome: `João Silva`
  - Telefone: `11999887766`
  - Quantidade: `2`
  - Observações: `Mesa perto da janela`
- Clique em **"Adicionar à Fila"**

**✅ Sucesso:** Cliente aparece na lista

### Passo 3: Chamar Cliente
- Clique no botão **"Chamar"** do cliente
- Status muda para `CHAMADO`

### Passo 4: Finalizar Atendimento
- Clique nos 3 pontinhos do cliente chamado
- Clique em **"Finalizar Atendimento"**
- Cliente sai da lista

**🎉 Se chegou até aqui: FUNCIONOU!**

---

## 🧪 TESTE 4: Fluxo do Cliente (App)

### Passo 1: Cadastrar Cliente
```
http://localhost:3001/cliente/cadastro
```

Preencha:
- Nome: `Maria Santos`
- Email: `maria@email.com`
- Telefone: `11988776655`
- CPF: `12345678900`
- Senha: `maria123`
- Cidade: `São Paulo` ⚠️ **Mesma cidade do restaurante!**
- Estado: `SP` ⚠️ **Mesmo estado do restaurante!**

**✅ Sucesso:** Redirecionado para lista de restaurantes

### Passo 2: Ver Restaurantes
Você deve ver o restaurante que cadastrou: "Trattoria Bella Vista"

Se NÃO aparecer: Verifique se cidade/estado são iguais.

### Passo 3: Entrar na Fila
- Clique no card do restaurante
- Escolha **"Fila Normal"**
- Quantidade: `2`
- Clique em **"Confirmar Entrada"**

**✅ Sucesso:** Redirecionado para tela de acompanhamento

### Passo 4: Ver Ticket
- Você verá sua posição na fila
- Tempo estimado
- Mensagem de boas-vindas

### Passo 5: Voltar ao Painel do Operador
- Abra outra aba/janela
- Faça login como Admin/Operador
- Vá para Painel Operador
- **Você verá Maria Santos na fila!**

### Passo 6: Chamar Maria
- Clique em "Chamar" na Maria
- Volte para a aba do cliente
- **Status mudou para "CHAMADO"!**

**🎉 INTEGRAÇÃO FUNCIONANDO 100%!**

---

## ❌ PROBLEMAS COMUNS

### 1. "Network Error" ao cadastrar
**Causa:** Backend não está rodando

**Solução:**
```bash
cd ../fila-restaurante-backend
npm run dev
```

---

### 2. "CORS Error" no console
**Causa:** FRONTEND_URL errado no backend

**Solução:**
1. Abra `.env` do **backend**
2. Mude para: `FRONTEND_URL=http://localhost:3001`
3. **Reinicie o backend**

---

### 3. "filaId não encontrado" no PainelOperador
**Causa:** Backend não retornou filaId no login

**Solução:**
1. Abra o Console (F12)
2. Vá para "Application" → "Local Storage"
3. Verifique se existe `filaAtivaId`
4. Se não existe:
   - O backend tem um problema
   - Verifique se o endpoint `/auth/login` retorna:
     ```json
     {
       "usuario": {
         "restaurante": {
           "filaAtiva": {
             "id": "uuid-aqui"
           }
         }
       }
     }
     ```

---

### 4. Cliente não vê restaurantes
**Causa:** Cidade/Estado diferentes

**Solução:**
- Cliente deve estar na **mesma cidade E estado** do restaurante
- Backend filtra por localização
- Cadastre o cliente com `São Paulo / SP` se o restaurante está em SP

---

### 5. "401 Unauthorized"
**Causa:** Token expirou

**Solução:**
1. Clique em "Sair"
2. Faça login novamente

---

## 🔍 COMO VER SE ESTÁ FUNCIONANDO

### Console do Navegador (F12)
Mensagens esperadas:
```
✅ Login realizado com sucesso
✅ FilaId salvo: uuid
✅ Fila carregada
✅ Cliente chamado
✅ Ticket criado
```

### Aba Network (Rede)
- Veja todas as requisições HTTP
- Status **200** ou **201** = Sucesso ✅
- Status **400** = Erro de validação ❌
- Status **401** = Não autenticado ❌
- Status **500** = Erro no servidor ❌

---

## 📋 CHECKLIST ANTES DE COMEÇAR

- [ ] Backend rodando em `localhost:3000`
- [ ] Frontend rodando em `localhost:3001`
- [ ] `.env` do backend tem `FRONTEND_URL=http://localhost:3001`
- [ ] Banco de dados PostgreSQL rodando
- [ ] Consegue acessar `http://localhost:3000/api/v1/health`

Se todos os itens estão ✅, pode começar!

---

## 🎯 FLUXO COMPLETO RESUMIDO

1. **Backend rodando** ✅
2. **Frontend rodando** ✅
3. **Cadastrar restaurante** (uma vez)
4. **Login admin** → Verificar filaId no console
5. **Adicionar cliente presencial** → Chamar → Finalizar
6. **Cadastrar cliente** (app)
7. **Entrar na fila** (app)
8. **Voltar ao operador** → Ver cliente na lista
9. **Chamar cliente** → Ver mudança no app do cliente

**Tempo total:** 10-15 minutos

---

## 📚 DOCUMENTAÇÃO COMPLETA

Depois de testar o básico, leia:

- **GUIA_INTEGRACAO_COMPLETA.md** - Guia detalhado com todos os endpoints
- **RESUMO_INTEGRACAO.md** - Lista de arquivos modificados
- **backend.md** - Documentação completa da API

---

## 🎉 PRONTO!

Siga os testes acima na ordem. Se tudo funcionar, a integração está completa!

**Boa sorte! 🚀**
