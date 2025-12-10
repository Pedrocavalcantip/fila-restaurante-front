# 🚀 Guia de Deploy - Fila Restaurante

## Arquitetura

```
┌─────────────────┐         ┌─────────────────┐
│     VERCEL      │  ──►    │    RAILWAY      │
│   (Frontend)    │   API   │   (Backend)     │
│   React/Vite    │   &     │   Node.js       │
│                 │   WS    │   PostgreSQL    │
└─────────────────┘         └─────────────────┘
```

---

## 1️⃣ Deploy do Backend no Railway

### Passo 1: Criar conta no Railway
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub

### Passo 2: Criar novo projeto
1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha o repositório do **backend**

### Passo 3: Adicionar PostgreSQL
1. No projeto, clique em **"+ New"**
2. Selecione **"Database" > "Add PostgreSQL"**
3. Railway criará automaticamente a variável `DATABASE_URL`

### Passo 4: Configurar variáveis de ambiente
No dashboard do Railway, vá em **Variables** e adicione:

```env
# Servidor
PORT=3000
NODE_ENV=production

# JWT (gere uma chave segura)
JWT_SECRET=sua-chave-super-secreta-de-32-caracteres

# CORS - URL do frontend no Vercel
CORS_ORIGIN=https://seu-frontend.vercel.app

# Database (Railway adiciona automaticamente)
# DATABASE_URL=postgresql://...
```

### Passo 5: Obter URL do backend
Após o deploy, copie a URL do Railway:
```
https://seu-projeto-production.up.railway.app
```

---

## 2️⃣ Deploy do Frontend no Vercel

### Passo 1: Criar conta no Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub

### Passo 2: Importar projeto
1. Clique em **"Add New" > "Project"**
2. Importe o repositório do **frontend**
3. Vercel detectará automaticamente que é Vite

### Passo 3: Configurar variáveis de ambiente
Em **Settings > Environment Variables**, adicione:

| Nome | Valor |
|------|-------|
| `VITE_API_URL` | `https://seu-backend.up.railway.app/api/v1` |
| `VITE_WS_URL` | `https://seu-backend.up.railway.app` |

⚠️ **IMPORTANTE**: Substitua `seu-backend` pela URL real do Railway!

### Passo 4: Deploy
1. Clique em **"Deploy"**
2. Aguarde o build finalizar
3. Acesse a URL gerada pelo Vercel

---

## 3️⃣ Configurar CORS no Backend

Após o deploy do frontend, volte ao Railway e atualize:

```env
CORS_ORIGIN=https://seu-frontend.vercel.app
```

Se precisar de múltiplas origens:
```env
CORS_ORIGIN=https://seu-frontend.vercel.app,https://www.seudominio.com
```

---

## 🔧 Comandos Úteis

### Desenvolvimento Local
```bash
# Frontend (este projeto)
npm run dev        # Inicia em http://localhost:3001

# Backend (outro repo)
npm run dev        # Inicia em http://localhost:3000
```

### Build de Produção
```bash
npm run build      # Gera pasta /dist
npm run preview    # Testa build localmente
```

---

## 🐛 Troubleshooting

### Erro de CORS
- Verifique se `CORS_ORIGIN` no Railway está correto
- Certifique-se de incluir `https://` na URL

### WebSocket não conecta
- Verifique se `VITE_WS_URL` está correto (sem `/api/v1`)
- Alguns hostings gratuitos podem ter limitações com WebSocket

### API retorna 404
- Confirme que `VITE_API_URL` termina com `/api/v1`
- Verifique se o backend está rodando no Railway

### Variáveis de ambiente não funcionam
- No Vite, as variáveis **devem** começar com `VITE_`
- Após mudar variáveis no Vercel, faça **redeploy**

---

## 📋 Checklist de Deploy

### Railway (Backend)
- [ ] Repositório conectado
- [ ] PostgreSQL adicionado
- [ ] `DATABASE_URL` configurada
- [ ] `JWT_SECRET` configurado
- [ ] `CORS_ORIGIN` configurado
- [ ] Deploy funcionando

### Vercel (Frontend)
- [ ] Repositório conectado
- [ ] `VITE_API_URL` configurado
- [ ] `VITE_WS_URL` configurado
- [ ] Deploy funcionando
- [ ] Testar login/cadastro
- [ ] Testar WebSocket (tempo real)

---

## 🔗 Links Úteis

- [Documentação Railway](https://docs.railway.app/)
- [Documentação Vercel](https://vercel.com/docs)
- [Vite - Variáveis de Ambiente](https://vitejs.dev/guide/env-and-mode.html)
