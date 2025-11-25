# ✅ Checklist de Integração com Backend

## 🔧 Configuração Inicial

### 1. Configurar URL do Backend
📁 **Arquivo:** `src/services/api.js`
```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // ← AJUSTAR PORTA SE NECESSÁRIO
});
```

### 2. Verificar Token JWT
- ✅ Interceptor configurado para adicionar `Authorization: Bearer {token}`
- ✅ Token salvo em `localStorage.setItem('token', ...)` após login

---

## 🔐 Autenticação

### Login Restaurante (Operador/Admin)
📁 **Arquivo:** `src/paginas/LoginRestaurante.jsx`

**Para ativar backend:**
1. Descomentar linhas 21-28
2. Comentar/remover mock (linhas 30-46)

**Payload esperado:**
```json
{
  "email": "admin@restaurante.com",
  "senha": "senha123",
  "restauranteSlug": "trattoria-bella-vista"
}
```

**Response esperado:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid",
    "nome": "Admin Principal",
    "email": "admin@restaurante.com",
    "role": "ADMIN", // ou "OPERADOR"
    "restaurante": {
      "id": "uuid",
      "nome": "Trattoria Bella Vista",
      "slug": "trattoria-bella-vista"
    }
  }
}
```

---

### Login Cliente
📁 **Arquivo:** `src/paginas/LoginCliente.jsx`

**Payload esperado:**
```json
{
  "email": "cliente@email.com",
  "senha": "senha123"
}
```

**Response esperado:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "cliente": {
    "id": "uuid",
    "nome": "João Silva",
    "email": "cliente@email.com",
    "telefone": "11987654321",
    "totalVisitas": 5,
    "totalNoShows": 0
  }
}
```

---

### Cadastro Cliente
📁 **Arquivo:** `src/paginas/CadastroCliente.jsx`

**Payload esperado:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "11987654321",
  "senha": "senha123",
  "cpf": "12345678900",
  "cidade": "São Paulo",
  "estado": "SP"
}
```

**⚠️ ATENÇÃO:** Não enviar `restauranteSlug` no cadastro de cliente!

---

## 🎟️ Tickets (Operador)

### Criar Ticket Presencial
📁 **Arquivo:** `src/paginas/PainelOperador.jsx` (função `adicionarClientePresencial`)

**Endpoint:** `POST /tickets/filas/{filaId}/tickets`

**Payload esperado:**
```json
{
  "nomeCliente": "Maria Santos",
  "telefone": "11987654321",
  "quantidadePessoas": 4,
  "observacoes": "Mesa perto da janela"
}
```

**⚠️ IMPORTANTE:** Você precisa ter o `filaId` do restaurante. Pode obter via:
- Endpoint `/restaurantes/meu-restaurante` (retorna fila ativa)
- Salvar em localStorage após login

---

### Listar Fila Ativa
📁 **Arquivo:** `src/paginas/PainelOperador.jsx` (função `carregarFila`)

**Endpoint:** `GET /tickets/filas/{filaId}/tickets/ativa`

**Response esperado:**
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
      "status": "AGUARDANDO",
      "prioridade": "NORMAL",
      "nomeCliente": "João Silva",
      "telefone": "11987654321",
      "quantidadePessoas": 4,
      "posicao": 5,
      "tempoEstimadoMinutos": 20,
      "chamadasCount": 0,
      "criadoEm": "2025-11-24T14:30:00.000Z"
    }
  ],
  "estatisticas": {
    "totalAguardando": 8,
    "totalChamados": 3
  }
}
```

---

### Ações do Operador

**Todas as ações precisam do `ticketId`:**

1. **Chamar:** `POST /tickets/{ticketId}/chamar`
2. **Rechamar:** `POST /tickets/{ticketId}/rechamar`
3. **Finalizar:** `POST /tickets/{ticketId}/finalizar`
4. **Pular:** `POST /tickets/{ticketId}/pular`
5. **No-Show:** `POST /tickets/{ticketId}/no-show`
6. **Cancelar:** `POST /tickets/{ticketId}/cancelar` (body: `{ "motivo": "..." }`)

📁 **Arquivo:** `src/paginas/PainelOperador.jsx`
- Funções: `chamarCliente`, `rechamarCliente`, `finalizarAtendimento`, etc.

---

## 📱 Tickets (Cliente)

### Buscar Restaurantes Próximos
📁 **Arquivo:** `src/paginas/RestaurantesDisponiveis.jsx`

**Endpoint:** `GET /cliente/restaurantes/proximos`

**Query params opcionais:**
- `cidade` (string)
- `nome` (string para busca)

**Response esperado:**
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
      "precoFastlane": 15.00,
      "mensagemBoasVindas": "Bem-vindo!",
      "filaAtiva": {
        "id": "uuid",
        "tamanhoFila": 8,
        "tempoEstimadoMinutos": 25
      }
    }
  ]
}
```

---

### Entrar na Fila
📁 **Arquivo:** `src/paginas/RestaurantesDisponiveis.jsx` (função `handleConfirmarEntrada`)

**Endpoint:** `POST /cliente/restaurantes/{slug}/fila/entrar`

**Payload esperado:**
```json
{
  "quantidadePessoas": 4,
  "prioridade": "NORMAL", // ou "FAST_LANE"
  "observacoes": "Cadeira de bebê"
}
```

**Response esperado:**
```json
{
  "ticket": {
    "id": "uuid",
    "numero": "A-045",
    "status": "AGUARDANDO",
    "prioridade": "NORMAL",
    "quantidadePessoas": 4,
    "posicaoAtual": 8,
    "tempoEstimadoMinutos": 25,
    "observacoes": "Cadeira de bebê",
    "criadoEm": "2025-11-24T15:00:00.000Z",
    "restaurante": {
      "id": "uuid",
      "nome": "Trattoria Bella Vista",
      "slug": "trattoria-bella-vista",
      "telefone": "11987654321",
      "endereco": "Rua Augusta, 1234",
      "mensagemBoasVindas": "Bem-vindo à Trattoria!"
    }
  }
}
```

---

### Buscar Meu Ticket
📁 **Arquivo:** `src/paginas/AcompanharFila.jsx` (função `carregarTicket`)

**Endpoint:** `GET /cliente/meu-ticket`

**Response esperado:** Igual ao response de "Entrar na Fila"

---

### Cancelar Ticket (Cliente)
📁 **Arquivo:** `src/paginas/AcompanharFila.jsx`

**Endpoint:** `POST /cliente/ticket/{ticketId}/cancelar`

**Payload:** Vazio ou `{ "motivo": "..." }`

---

## 🏢 Gerenciamento de Restaurante

### Buscar Dados do Restaurante
📁 **Arquivo:** `src/paginas/Gerenciamento.jsx` (aba Configurações)

**Endpoint:** `GET /restaurantes/meu-restaurante`

**Response esperado:**
```json
{
  "restaurante": {
    "id": "uuid",
    "nome": "Trattoria Bella Vista",
    "slug": "trattoria-bella-vista",
    "telefone": "11987654321",
    "endereco": "Rua Augusta, 1234 - São Paulo",
    "capacidade": 50,
    "tempoMedioAtendimentoMinutos": 45,
    "precoFastlane": 15.00,
    "maxReentradasPorDia": 3,
    "mensagemBoasVindas": "Bem-vindo à Trattoria!",
    "filaAtiva": {
      "id": "uuid",
      "nome": "Fila Principal"
    }
  }
}
```

---

### Atualizar Configurações
📁 **Arquivo:** `src/paginas/Gerenciamento.jsx` (função `handleSalvarConfiguracoes`)

**Endpoint:** `PATCH /restaurantes/meu-restaurante`

**Payload esperado:**
```json
{
  "nome": "Trattoria Bella Vista",
  "telefone": "11987654321",
  "endereco": "Rua Augusta, 1234 - São Paulo",
  "capacidade": 50,
  "tempoMedioAtendimentoMinutos": 45,
  "precoFastlane": 15.00,
  "maxReentradasPorDia": 3,
  "mensagemBoasVindas": "Bem-vindo!",
  "horarios": {
    "segunda": { "aberto": true, "inicio": "11:00", "fim": "23:00" },
    "terca": { "aberto": true, "inicio": "11:00", "fim": "23:00" }
  }
}
```

**⚠️ NOTA:** O backend pode não suportar horários ainda. Verifique documentação.

---

## 📊 Histórico de Tickets

### Listar Histórico
📁 **Arquivo:** `src/paginas/HistoricoTickets.jsx`

**Endpoint:** `GET /tickets/filas/{filaId}/tickets/historico`

**Query params opcionais:**
- `busca` (string) - Busca por número ou nome
- `status` (string) - "FINALIZADO", "CANCELADO", "NO_SHOW"
- `page` (number)
- `limit` (number)

**Response esperado:**
```json
{
  "tickets": [...],
  "paginacao": {
    "paginaAtual": 1,
    "totalPaginas": 5,
    "totalItens": 50,
    "itensPorPagina": 10
  }
}
```

---

### Detalhes do Ticket
📁 **Arquivo:** `src/paginas/DetalhesTicket.jsx`

**Endpoint:** `GET /tickets/{ticketId}`

**Response esperado:**
```json
{
  "ticket": {
    "id": "uuid",
    "numero": "A-023",
    "status": "FINALIZADO",
    "prioridade": "NORMAL",
    "nomeCliente": "João Silva",
    "telefone": "11987654321",
    "quantidadePessoas": 4,
    "observacoes": "Mesa perto da janela",
    "criadoEm": "2025-11-24T14:30:00.000Z",
    "finalizadoEm": "2025-11-24T15:00:00.000Z",
    "eventos": [
      {
        "tipo": "CRIADO",
        "descricao": "Ticket criado",
        "dataHora": "2025-11-24T14:30:00.000Z",
        "operador": null
      },
      {
        "tipo": "CHAMADO",
        "descricao": "Cliente chamado",
        "dataHora": "2025-11-24T14:55:00.000Z",
        "operador": {
          "nome": "Carlos Silva"
        }
      },
      {
        "tipo": "FINALIZADO",
        "descricao": "Atendimento finalizado",
        "dataHora": "2025-11-24T15:00:00.000Z",
        "operador": {
          "nome": "Carlos Silva"
        }
      }
    ]
  }
}
```

---

## 🌍 Painel Público (TV)

### Buscar Ticket Público
📁 **Arquivo:** `src/paginas/PainelPublico.jsx`

**Endpoint:** `GET /tickets/publico/{ticketId}`

**⚠️ SEM AUTENTICAÇÃO**

**Response esperado:**
```json
{
  "ticket": {
    "numero": "A-023",
    "posicao": 5,
    "status": "AGUARDANDO",
    "tempoEstimado": 15
  }
}
```

---

## 🚨 Pontos Críticos de Atenção

### 1. `filaId` é obrigatório!
Muitas rotas de ticket precisam de `filaId`. Você deve:
- Obter do endpoint `/restaurantes/meu-restaurante` após login
- Salvar em localStorage: `localStorage.setItem('filaAtivaId', filaId)`
- Usar em todas as chamadas de ticket do operador

### 2. Prioridades
- Backend suporta: `NORMAL`, `FAST_LANE`, `VIP`
- Frontend removeu `VIP` (você decidiu usar só NORMAL e FAST_LANE)
- **Certifique-se** de que o backend aceita isso ou mantenha VIP se necessário

### 3. Campo `mensagemBoasVindas`
- Foi adicionado no frontend
- **Verificar** se backend já suporta esse campo
- Se não, backend precisa adicionar na tabela `restaurantes`

### 4. Horários de Funcionamento
- Frontend envia objeto completo de horários
- Backend pode não ter essa estrutura ainda
- **Verificar** com backend antes de integrar essa parte

### 5. Status dos Tickets
Backend usa:
- `AGUARDANDO`
- `CHAMADO`
- `FINALIZADO`
- `NO_SHOW`
- `CANCELADO`
- `CANCELADO_CLIENTE` (quando cliente cancela)

Frontend deve tratar todos esses status.

---

## 🔄 WebSocket (Real-Time)

### Conexão WebSocket
📁 **Para implementar depois:**

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: localStorage.getItem('restauranteToken')
  }
});

// Escutar eventos de ticket
socket.on('ticket:chamado', (data) => {
  console.log('Ticket chamado:', data);
  // Atualizar lista de tickets
});

socket.on('ticket:finalizado', (data) => {
  console.log('Ticket finalizado:', data);
  // Atualizar lista de tickets
});
```

**Eventos importantes:**
- `ticket:chamado` - Quando ticket é chamado
- `ticket:finalizado` - Quando atendimento é concluído
- `ticket:cancelado` - Quando ticket é cancelado
- `fila:atualizada` - Quando posições mudam

---

## ✅ Checklist Final Antes de Integrar

- [ ] URL do backend configurada em `api.js`
- [ ] Backend rodando e acessível
- [ ] Testar login de restaurante manualmente (Postman/Insomnia)
- [ ] Testar login de cliente manualmente
- [ ] Verificar se backend retorna `filaId` no login/restaurante
- [ ] Confirmar estrutura de response do backend (pode variar da documentação)
- [ ] Descomentar código de integração nos arquivos principais
- [ ] Comentar/remover código mock
- [ ] Testar fluxo completo: Login → Criar Ticket → Chamar → Finalizar
- [ ] Implementar tratamento de erros (try/catch com mensagens amigáveis)
- [ ] Adicionar loading states em todas as chamadas
- [ ] Testar WebSocket se backend suportar

---

## 📝 Ordem Recomendada de Integração

1. **Login Restaurante** - Essencial para acessar outras rotas
2. **Buscar Dados do Restaurante** - Para obter filaId
3. **Listar Fila Ativa** - PainelOperador
4. **Ações do Operador** - Chamar, finalizar, etc.
5. **Login Cliente** - Fluxo do cliente
6. **Cadastro Cliente** - Registro de novos clientes
7. **Buscar Restaurantes** - Lista de restaurantes
8. **Entrar na Fila** - Cliente entra na fila
9. **Buscar Meu Ticket** - Acompanhamento
10. **Histórico** - Últimas funcionalidades
11. **WebSocket** - Real-time (opcional no início)

---

## 🆘 Troubleshooting

### Erro 401 (Unauthorized)
- Verificar se token está sendo enviado no header
- Token pode ter expirado
- Fazer login novamente

### Erro 404 (Not Found)
- Verificar URL do endpoint
- Confirmar que rota existe no backend
- Verificar se `filaId` ou `ticketId` está correto

### Erro 400 (Bad Request)
- Payload está incorreto
- Falta campo obrigatório
- Tipo de dado errado (string vs number)

### CORS Error
- Backend precisa configurar CORS
- Adicionar origem do frontend (`http://localhost:5173`)

---

**Boa integração! 🚀**
