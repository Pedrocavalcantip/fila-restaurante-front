# 🗺️ Fluxos de Navegação - Sistema de Fila

## 📱 Fluxo do Cliente

### Tela Inicial
- **URL**: `/`
- **Tela**: `EscolhaPerfil`
- **Ações**:
  - Botão "Sou Cliente" → `/cliente/login`
  - Botão "Sou Restaurante" → `/restaurante/login`

### Login do Cliente
- **URL**: `/cliente/login`
- **Tela**: `LoginCliente`
- **Credenciais Mockadas**: `1234@gmail.com` / `1234`
- **Ações**:
  - Login bem-sucedido → `/cliente/restaurantes`
  - Link "Cadastre-se" → `/cliente/cadastro`

### Cadastro do Cliente
- **URL**: `/cliente/cadastro`
- **Tela**: `CadastroCliente`
- **Ações**:
  - Cadastro bem-sucedido → `/cliente/restaurantes`

### Restaurantes Disponíveis
- **URL**: `/cliente/restaurantes`
- **Tela**: `RestaurantesDisponiveis`
- **Ações**:
  - Clicar em "Entrar na Fila" → Abre modal `EntrarNaFila`
  - Banner "Acompanhar Fila" (se tiver ticket ativo) → `/cliente/meu-ticket`
  - Menu dropdown:
    - "Meu Perfil" → `/cliente/perfil`
    - "Sair" → `/cliente/login`

### Entrar na Fila (Modal)
- **Componente**: `EntrarNaFila`
- **Exibição**: Modal overlay na tela de restaurantes
- **Ações**:
  - Confirmar → Cria ticket e vai para `/cliente/meu-ticket`
  - Fechar (X ou overlay) → Volta para lista de restaurantes

### Acompanhar Fila
- **URL**: `/cliente/meu-ticket`
- **Tela**: `AcompanharFila`
- **Funcionalidades**:
  - Auto-atualização a cada 10 segundos
  - Timeline com status do ticket
  - Menu dropdown:
    - "Meu Perfil" → `/cliente/perfil`
    - "Sair" → `/cliente/login`

### Perfil do Cliente
- **URL**: `/cliente/perfil`
- **Tela**: `PerfilCliente`
- **Funcionalidades**:
  - Ver estatísticas (visitas, fast lane, no-shows)
  - Editar dados pessoais
  - **NOVO**: Botão "Ver Histórico Completo" → `/cliente/historico`
- **Ações**:
  - Botão "Voltar" → `/cliente/restaurantes`

### ✨ Histórico do Cliente (NOVA)
- **URL**: `/cliente/historico`
- **Tela**: `HistoricoClienteTickets`
- **Funcionalidades**:
  - Cards de estatísticas (total, finalizados, cancelados, no-shows, tempo médio)
  - Lista completa de tickets anteriores
  - Filtros por status (Todos, Finalizados, Cancelados, No-Show)
  - Informações detalhadas de cada visita
- **Ações**:
  - Botão "Voltar" → `/cliente/perfil`

---

## 🏪 Fluxo do Restaurante

### Login do Restaurante
- **URL**: `/restaurante/login`
- **Tela**: `LoginRestaurante`
- **Ações**:
  - Login bem-sucedido → `/restaurante/painel`
  - Link "Cadastre seu restaurante" → `/restaurante/cadastro`

### Cadastro do Restaurante
- **URL**: `/restaurante/cadastro`
- **Tela**: `CadastroRestaurante`
- **Ações**:
  - Cadastro bem-sucedido → `/restaurante/login`

### Painel Administrativo
- **URL**: `/restaurante/painel`
- **Tela**: `PainelAdministrativo`
- **Cards de Navegação**:
  1. **Gerenciamento** → `/restaurante/gerenciamento`
     - Gerencie equipe, operadores e filas
  
  2. **Painel do Operador** → `/restaurante/painel-operador`
     - Fila ao vivo em tempo real
  
  3. **✨ Configurações (NOVO)** → `/restaurante/configuracoes`
     - Configure preços, limites e informações
  
  4. **✨ Histórico (NOVO)** → `/restaurante/historico-tickets`
     - Consulte histórico completo de tickets
  
  5. **✨ Painel Público (TV) (NOVO)** → `/publico/painel`
     - Display para TV com tickets chamados

### Gerenciamento
- **URL**: `/restaurante/gerenciamento`
- **Tela**: `Gerenciamento`
- **Ações**:
  - Botão "Gerenciar Filas" → `/restaurante/gerenciamento/filas`
  - Botão "Voltar" → `/restaurante/painel`

### Gerenciamento de Filas
- **URL**: `/restaurante/gerenciamento/filas`
- **Tela**: `GerenciamentoFilas`
- **Ações**:
  - Botão "Voltar" → `/restaurante/gerenciamento`

### Painel do Operador (Fila ao Vivo)
- **URL**: `/restaurante/painel-operador`
- **Tela**: `PainelOperador`
- **Funcionalidades**:
  - Ver tickets em tempo real
  - Chamar clientes
  - Finalizar atendimento
  - Cancelar tickets
  - Auto-atualização a cada 5 segundos
  - **NOVOS BOTÕES**:
    - "Painel TV" → `/publico/painel`
    - "Histórico" → `/restaurante/historico-tickets`
    - "Configurações" → `/restaurante/configuracoes`
    - "Atualizar" → Recarrega fila
- **Ações**:
  - Clicar em ticket → Abre modal com detalhes
  - Botão "Voltar" → `/restaurante/painel`

### ✨ Histórico de Tickets (NOVA)
- **URL**: `/restaurante/historico-tickets`
- **Tela**: `HistoricoTickets`
- **Funcionalidades**:
  - Tabela paginada (10 por página)
  - Busca por número, nome ou telefone
  - Filtros por status (Todos, Finalizados, Cancelados, No-Show)
  - Ver detalhes de cada ticket
- **Ações**:
  - Clicar "Ver detalhes" → `/restaurante/ticket/{ticketId}`
  - Botão "Voltar" → `/restaurante/painel-operador`

### ✨ Detalhes do Ticket (NOVA)
- **URL**: `/restaurante/ticket/:ticketId`
- **Tela**: `DetalhesTicket`
- **Funcionalidades**:
  - Informações completas do cliente
  - Informações do ticket
  - Observações e motivo de cancelamento
  - Timeline completa de eventos (logs)
  - Operadores que realizaram ações
- **Ações**:
  - Botão "Voltar" → Volta para tela anterior

### ✨ Configurações do Restaurante (NOVA)
- **URL**: `/restaurante/configuracoes`
- **Tela**: `ConfiguracoesRestaurante`
- **Funcionalidades**:
  - Editar informações da empresa (CNPJ, telefone, email)
  - Atualizar endereço completo
  - Configurar preços (Fast Lane, VIP)
  - Definir limites de tickets por cliente
  - Configurar tempo de tolerância para No-Show
  - Mensagem personalizada de boas-vindas
- **Ações**:
  - Botão "Salvar Configurações" → Salva alterações
  - Botão "Voltar" → `/restaurante/painel-operador`

---

## 📺 Painel Público

### ✨ Painel Público (TV) (NOVA)
- **URL**: `/publico/painel`
- **Tela**: `PainelPublico`
- **Funcionalidades**:
  - Design otimizado para TV/display público
  - Mostra tickets chamados recentemente
  - Relógio em tempo real
  - Animação de pulso no ticket mais recente
  - Auto-atualização a cada 3 segundos
  - **SEM AUTENTICAÇÃO NECESSÁRIA**
- **Uso**:
  - Abra em uma TV ou monitor grande
  - Deixe em tela cheia (F11 no navegador)
  - Clientes veem seus tickets quando são chamados

---

## 🎯 Resumo dos Acessos Rápidos

### Cliente:
1. Login → Restaurantes → Entrar na Fila (modal) → Acompanhar Fila
2. Perfil → Histórico Completo

### Restaurante (Operador):
1. Login → Painel Administrativo → Painel do Operador
2. Painel Operador → Histórico de Tickets → Detalhes do Ticket
3. Painel Operador → Configurações
4. Painel Operador → Painel TV

### Público:
1. Acesso direto: `/publico/painel` (sem login)

---

## 🔄 Fluxos de Atualização Automática

- **AcompanharFila**: Atualiza a cada 10 segundos
- **PainelOperador**: Atualiza a cada 5 segundos
- **PainelPublico**: Atualiza a cada 3 segundos
- **PainelPublico**: Relógio atualiza a cada 1 segundo

---

## 💡 Dicas de Teste

1. **Cliente**: 
   - Use `1234@gmail.com` / `1234` para login
   - Experimente entrar na fila e acompanhar
   - Veja seu histórico no perfil

2. **Restaurante**: 
   - Faça login e explore o painel administrativo
   - Acesse o painel do operador para gerenciar filas
   - Configure preços e limites nas configurações
   - Veja o histórico completo de tickets

3. **TV Pública**: 
   - Abra `/publico/painel` em uma nova aba
   - Use F11 para tela cheia
   - Veja os tickets sendo chamados em tempo real
