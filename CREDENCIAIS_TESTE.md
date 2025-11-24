# 🔑 Credenciais de Teste

## 🏢 Restaurante: Trattoria Bella Vista

### 👨‍💼 ADMINISTRADOR (Acesso Total)
- **Email:** `admin@trattoria.com`
- **Senha:** `admin123`
- **Slug do Restaurante:** `trattoria-bella-vista`
- **Permissões:** 
  - Gerenciamento de equipe
  - Gerenciamento de filas
  - Configurações do restaurante
  - Relatórios e analytics
  - Cadastrar novos operadores

---

### 👤 OPERADOR (Gerenciamento de Filas)
- **Email:** `operador@trattoria.com`
- **Senha:** `operador123`
- **Slug do Restaurante:** `trattoria-bella-vista`
- **Permissões:**
  - Visualizar filas
  - Chamar tickets
  - Finalizar atendimentos
  - Marcar no-shows
  - Criar tickets presenciais

---

## 📋 Como Usar

### Para fazer login:
1. Acesse `/restaurante/login`
2. Digite o **email** do usuário
3. Digite a **senha**
4. Digite o **slug do restaurante**: `trattoria-bella-vista`
5. Clique em "Entrar"

### Diferenças entre os papéis:

**ADMIN:**
- Redireciona para `/restaurante/painel` (Painel Administrativo)
- Pode acessar todas as funcionalidades
- Pode criar e remover operadores

**OPERADOR:**
- Redireciona para `/restaurante/painel-operador` (Painel do Operador)
- Foco em gerenciar filas e atendimentos
- Não tem acesso às configurações do restaurante

---

## 🎯 Testando os Fluxos

### Como ADMIN:
1. Login com credenciais de admin
2. Acesse "Gerenciar Equipe" para adicionar operadores
3. Acesse "Gerenciar Filas" para configurar filas
4. Visualize relatórios e estatísticas

### Como OPERADOR:
1. Login com credenciais de operador
2. Visualize as filas ativas
3. Chame próximo cliente
4. Finalize atendimentos
5. Gerencie tickets presenciais

---

## 🔧 Configurações do Restaurante (Backend)

Quando integrar com o backend, use estes dados no cadastro:

```json
{
  "nome": "Trattoria Bella Vista",
  "slug": "trattoria-bella-vista",
  "emailAdmin": "admin@trattoria.com",
  "senhaAdmin": "admin123",
  "precoFastlane": 15,
  "precoVip": 25,
  "maxReentradasPorDia": 3,
  "cnpj": "12.345.678/0001-90",
  "telefone": "(11) 98765-4321",
  "cep": "01310-100",
  "rua": "Av. Paulista",
  "numero": "1000",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "estado": "SP"
}
```

---

## 📝 Notas Importantes

- As credenciais acima são apenas para **ambiente de desenvolvimento/testes**
- O sistema atualmente usa **mock data** (dados simulados)
- Quando o backend estiver integrado, os logins serão validados pelo servidor
- O `slug` é **obrigatório** no login e identifica o restaurante de forma única
- A senha deve ter no mínimo 6 caracteres

---

## 🆘 Problemas Comuns

**"Credenciais inválidas"**
- Verifique se digitou o slug corretamente: `trattoria-bella-vista`
- Confirme email e senha

**"Não consegui escolher se sou operador ou admin"**
- O sistema detecta automaticamente baseado no email cadastrado
- Use `admin@trattoria.com` para ADMIN
- Use `operador@trattoria.com` para OPERADOR

**"Página não carrega após login"**
- Verifique se está sendo redirecionado corretamente
- ADMIN vai para `/restaurante/painel`
- OPERADOR vai para `/restaurante/painel-operador`
