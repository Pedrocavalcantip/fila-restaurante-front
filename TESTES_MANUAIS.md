# 🧪 Guia de Testes Manuais - Frontend

## 🚀 Como Iniciar os Testes

1. Abra o terminal e rode:
   ```bash
   npm run dev
   ```
2. Acesse: `http://localhost:5173`
3. Abra o DevTools (F12) para ver logs no console

---

## ✅ CHECKLIST DE TESTES

## 📱 FLUXO DO CLIENTE

### Teste 1: Login e Cadastro
- ✅ **1.1** - Acessar tela inicial `/` 
- ✅ **1.2** - Clicar em "Sou Cliente"
- ✅ **1.3** - Verificar se vai para `/cliente/login`
- ✅ **1.4** - Testar login com credenciais mockadas:
  - Email: `1234@gmail.com`
  - Senha: `1234`
- ✅ **1.5** - Clicar "Entrar" e verificar se redireciona para `/cliente/restaurantes`
- ✅ **1.6** - Voltar para login e clicar em "Cadastre-se"
- ✅ **1.7** - Preencher formulário de cadastro
- ✅ **1.8** - Verificar se todos os campos estão funcionando
- ✅ **1.9** - Submeter e verificar redirecionamento

**Resultado Esperado:** 
- Navegação fluida entre telas
- Credenciais mockadas funcionam
- Formulários validam campos obrigatórios

---

### Teste 2: Visualizar Restaurantes
- ✅ **2.1** - Na tela `/cliente/restaurantes`, verificar se aparecem cards de restaurantes
- ✅ **2.2** - Verificar se cada card mostra:
  - Imagem do restaurante
  - Nome
  - Endereço
  - Tamanho da fila
  - Tempo estimado
- ✅ **2.3** - Verificar menu dropdown do perfil (canto superior direito)
- ✅ **2.4** - Clicar em "Meu Perfil" no menu
- ✅ **2.5** - Verificar se vai para `/cliente/perfil`
- ✅ **2.6** - Voltar para restaurantes

**Resultado Esperado:**
- Lista de restaurantes mockados aparece
- Todas as informações visíveis
- Menu dropdown funciona
- Navegação para perfil funciona

---

### Teste 3: Entrar na Fila (Modal)
- ✅ **3.1** - Na lista de restaurantes, clicar em "Entrar na Fila" em qualquer restaurante
- ✅ **3.2** - Verificar se abre um **modal** (não navega para outra página)
- ✅ **3.3** - Verificar se o modal tem fundo escurecido (overlay)
- ✅ **3.4** - Tentar clicar fora do modal - deve fechar
- ✅ **3.5** - Abrir novamente e clicar no X - deve fechar
- ✅ **3.6** - Abrir novamente e preencher:
  - Quantidade de pessoas: `4`
  - Observações: `Cadeira de bebê, por favor`
- ✅ **3.7** - Clicar em "Confirmar"
- ✅ **3.8** - Verificar se redireciona para `/cliente/meu-ticket`

**Resultado Esperado:**
- Modal abre corretamente sobre a tela
- Não navega para outra página ao abrir
- Overlay e botão X fecham o modal
- Confirmar cria ticket e redireciona

---

### Teste 4: Acompanhar Fila
- ✅ **4.1** - Na tela `/cliente/meu-ticket`, verificar se mostra:
  - Número do ticket
  - Posição na fila
  - Tempo estimado
  - Status do ticket
  - Timeline com etapas
- ✅ **4.2** - Verificar se o card com informações está visível
- ✅ **4.3** - Verificar o botão "Cancelar Ticket"
- ✅ **4.4** - Verificar menu dropdown no header
- ✅ **4.5** - Esperar ~10 segundos e ver se há alguma atualização (auto-refresh)
- ✅ **4.6** - Clicar em "Meu Perfil" no menu
- ✅ **4.7** - Voltar e testar navegação

**Resultado Esperado:**
- Todas as informações do ticket visíveis
- Timeline mostra progresso
- Menu dropdown funciona
- Auto-refresh acontece (console.log deve aparecer)

---

### Teste 5: Perfil do Cliente
- ✅ **5.1** - Acessar `/cliente/perfil`
- ✅ **5.2** - Verificar se mostra:
  - Banner VIP (se cliente for VIP)
  - Cards de estatísticas (visitas, fast lane, no-shows)
  - Dados pessoais
- ✅ **5.3** - Clicar no botão "Ver Histórico Completo"
- ✅ **5.4** - Verificar se vai para `/cliente/historico`
- ✅ **5.5** - Voltar e clicar em "Editar"
- ✅ **5.6** - Alterar algum campo (ex: telefone)
- ✅ **5.7** - Clicar em "Salvar Alterações"
- ✅ **5.8** - Verificar se salvou (localStorage)
- ✅ **5.9** - Clicar em "Cancelar" durante edição
- ✅ **5.10** - Verificar se restaura valores originais

**Resultado Esperado:**
- Perfil mostra todas as informações
- Botão de histórico funciona
- Modo de edição funciona
- Salvar persiste no localStorage
- Cancelar reverte mudanças

---

### Teste 6: Histórico de Tickets do Cliente
- ✅ **6.1** - Na tela `/cliente/historico`, verificar:
  - Cards de estatísticas no topo
  - Lista de tickets anteriores
- ✅ **6.2** - Clicar nos filtros
- ✅ **6.3** - Verificar se a lista filtra corretamente
- ✅ **6.4** - Verificar informações de cada ticket:
  - Restaurante
  - Data
  - Status
  - Tempo de espera
  - Valor pago

**Resultado Esperado:**
- Estatísticas aparecem
- Filtros funcionam
- Lista atualiza conforme filtro selecionado

---

## 🏪 FLUXO DO RESTAURANTE

### Teste 7: Login Restaurante
- ✅ **7.1** - Voltar para `/` 
- ✅ **7.2** - Clicar em "Sou Restaurante"
- ✅ **7.3** - Verificar se vai para `/restaurante/login`
- ✅ **7.4** - Verificar se tem campo para slug do restaurante
- ✅ **7.5** - Preencher campos mockados (se houver)
- ✅ **7.6** - Clicar "Entrar"
- ✅ **7.7** - Verificar se redireciona para `/restaurante/painel`

**Resultado Esperado:**
- Tela de login carrega
- Formulário funciona
- Redireciona para painel

---

### Teste 8: Painel Administrativo
- ✅ **8.1** - Na tela `/restaurante/painel`, verificar cards:
- ✅ **8.2** - Clicar em cada card e verificar navegação:

**Resultado Esperado:**
- Todos os 5 cards visíveis
- Todas as navegações funcionam
- Visual consistente

---

### Teste 9: Painel do Operador (Fila ao Vivo)
- ✅ **9.1** - Acessar `/restaurante/painel-operador`
- ✅ **9.2** - Verificar se mostra:
  - Cards de estatísticas (Aguardando, Chamados, Total)
  - Lista de tickets na fila
- ✅ **9.3** - Verificar botões no header:
- ✅ **9.4** - Clicar em "Atualizar" e ver loading
- ✅ **9.5** - Clicar em um ticket da lista
- ✅ **9.6** - Verificar se abre modal com detalhes
- ✅ **9.8** - Fechar modal (X ou fora)
- ✅ **9.9** - Clicar em "Painel TV"
- ✅ **9.10** - Verificar se abre `/publico/painel`

**Resultado Esperado:**
- Estatísticas aparecem
- Lista de tickets visível
- Modal de detalhes funciona
- Botões de ação aparecem (mesmo que mockados)
- Navegação para outras telas funciona

---

### Teste 10: Histórico de Tickets (Operador)
- ✅ **10.1** - Acessar `/restaurante/historico-tickets`
- [ ] **10.2** - Verificar:
  - Barra de busca
  - Filtros de status
  - Tabela com tickets
  - Paginação
- ✅ **10.3** - Testar busca digitando um número de ticket
- ✅ **10.4** - Clicar nos filtros de status
- ✅ **10.5** - Verificar se a tabela filtra
- ✅ **10.6** - Clicar em "Ver detalhes" de algum ticket
- ✅ **10.7** - Verificar se vai para `/restaurante/ticket/{id}`
- ✅ **10.8** - Testar paginação (se houver mais de 10 tickets)

**Resultado Esperado:**
- Tabela carrega com dados
- Busca filtra resultados
- Filtros de status funcionam
- "Ver detalhes" navega corretamente
- Paginação funciona

---

### Teste 11: Detalhes do Ticket
- ✅ **11.1** - Na tela `/restaurante/ticket/{id}`, verificar:
  - Informações do cliente
  - Informações do ticket
  - Timeline de eventos
  - Status colorido
- ✅ **11.2** - Verificar badges de VIP/Fast Lane (se aplicável)
- ✅ **11.3** - Verificar timeline com eventos
- ✅ **11.4** - Cada evento deve mostrar:
  - Ícone
  - Descrição
  - Data/hora
  - Operador (se houver)
- ✅ **11.5** - Clicar em "Voltar"
- ✅ **11.6** - Verificar se volta para tela anterior

**Resultado Esperado:**
- Todas as informações visíveis
- Timeline mostra histórico completo
- Badges aparecem quando necessário
- Botão voltar funciona

---

### Teste 12: Configurações do Restaurante
- ✅ **12.1** - Acessar `/restaurante/gerenciamento` e clicar na aba "Configurações"
- ✅ **12.2** - Verificar seções:
- ✅ **12.3** - Editar campos:
  - Mudar preço Fast Lane
  - Alterar limite de tickets
  - Modificar mensagem
- ✅ **12.4** - Clicar em "Salvar Configurações"
- ✅ **12.5** - Verificar mensagem de sucesso
- ✅ **12.6** - Recarregar página
- ✅ **12.7** - Verificar se mantém valores (localStorage)

**Resultado Esperado:**
- Todas as seções visíveis
- Formulário editável
- Salvar funciona
- Dados persistem no localStorage

---

### Teste 13: Painel Público (TV)
- [ ] **13.1** - Acessar `/publico/painel`
- [ ] **13.2** - Verificar:
  - Design otimizado para TV (texto grande)
  - Relógio em tempo real no topo
  - Lista de tickets chamados
  - Animação no ticket mais recente
- [ ] **13.3** - Pressionar F11 para tela cheia
- [ ] **13.4** - Verificar se fica bom em tela grande
- [ ] **13.5** - Sair de tela cheia (ESC)
- [ ] **13.6** - Clicar no botão "Voltar"
- [ ] **13.7** - Verificar se volta para tela anterior

**Resultado Esperado:**
- Visual otimizado para TV/monitor grande
- Relógio atualiza a cada segundo
- Tickets aparecem com destaque
- Animação de pulso no mais recente
- Botão voltar funciona

---

## 🔄 TESTES DE NAVEGAÇÃO E ESTADO

### Teste 14: Persistência de Dados
- [ ] **14.1** - Fazer login como cliente
- [ ] **14.2** - Entrar em uma fila
- [ ] **14.3** - Fechar o navegador completamente
- [ ] **14.4** - Abrir novamente em `http://localhost:5173`
- [ ] **14.5** - Acessar `/cliente/meu-ticket`
- [ ] **14.6** - Verificar se o ticket ainda está lá

**Resultado Esperado:**
- Dados persistem após fechar navegador
- Token e dados de usuário mantidos
- Ticket ativo mantido

---

### Teste 15: Menu Dropdown
- [ ] **15.1** - Em qualquer tela com menu dropdown (cliente)
- [ ] **15.2** - Clicar no ícone de perfil
- [ ] **15.3** - Verificar se abre menu com:
  - Meu Perfil
  - Sair
- [ ] **15.4** - Clicar fora do menu - deve fechar
- [ ] **15.5** - Abrir novamente e clicar em "Meu Perfil"
- [ ] **15.6** - Verificar navegação
- [ ] **15.7** - Voltar e clicar em "Sair"
- [ ] **15.8** - Verificar se limpa sessão e volta para login

**Resultado Esperado:**
- Menu abre e fecha corretamente
- Opções navegam para telas corretas
- Sair limpa dados e redireciona

---

### Teste 16: Responsividade Mobile
- [ ] **16.1** - Abrir DevTools (F12)
- [ ] **16.2** - Ativar modo responsivo (Ctrl+Shift+M)
- [ ] **16.3** - Testar em tamanhos:
  - [ ] iPhone SE (375px)
  - [ ] iPhone 12 Pro (390px)
  - [ ] iPad (768px)
  - [ ] Desktop (1920px)
- [ ] **16.4** - Navegar pelas principais telas
- [ ] **16.5** - Verificar se layout se adapta
- [ ] **16.6** - Verificar se botões são clicáveis
- [ ] **16.7** - Verificar se textos são legíveis

**Resultado Esperado:**
- Layout se adapta a diferentes tamanhos
- Nada quebra ou sobrepõe
- Tudo clicável e legível

---

## 🐛 TESTES DE ERRO E EDGE CASES

### Teste 17: Validação de Formulários
- [ ] **17.1** - Tentar fazer login sem preencher campos
- [ ] **17.2** - Verificar se mostra mensagem de erro
- [ ] **17.3** - Tentar cadastro sem email válido
- [ ] **17.4** - Tentar cadastro com senha muito curta
- [ ] **17.5** - Tentar entrar na fila sem quantidade de pessoas

**Resultado Esperado:**
- Formulários validam campos obrigatórios
- Mensagens de erro claras
- Não submete com dados inválidos

---

### Teste 18: Navegação por URLs
- [ ] **18.1** - Digitar diretamente na barra:
  - `/cliente/perfil`
  - `/cliente/historico`
  - `/restaurante/painel`
  - `/publico/painel`
- [ ] **18.2** - Verificar se carrega corretamente
- [ ] **18.3** - Testar URL inexistente: `/pagina-que-nao-existe`
- [ ] **18.4** - Verificar comportamento

**Resultado Esperado:**
- URLs diretas funcionam
- Rotas protegidas podem pedir login (opcional por enquanto)
- 404 ou redirecionamento para rotas inexistentes

---

## ✅ CHECKLIST FINAL

Após todos os testes, verificar:

- [ ] Todas as 18 telas carregam corretamente
- [ ] Navegação entre telas funciona
- [ ] Modais abrem e fecham corretamente
- [ ] Dados persistem no localStorage
- [ ] Menu dropdown funciona em todas as telas
- [ ] Botões de voltar funcionam
- [ ] Layout é responsivo
- [ ] Não há erros no console (F12 → Console)
- [ ] Não há warnings no console
- [ ] Todos os ícones aparecem (lucide-react)
- [ ] Cores e estilos Tailwind funcionam
- [ ] Auto-refresh funciona onde implementado

---

## 📝 RELATÓRIO DE BUGS

Use este template para reportar problemas encontrados:

```
### BUG: [Título curto]
**Tela:** /caminho/da/tela
**Passos para reproduzir:**
1. 
2. 
3. 

**Comportamento esperado:**
[O que deveria acontecer]

**Comportamento atual:**
[O que está acontecendo]

**Console (F12):**
[Copiar erros do console, se houver]

**Screenshot:**
[Se possível, anexar print]
```

---

## 🎯 ORDEM SUGERIDA DE TESTES

**Sessão 1 - Cliente (30 min):**
- Testes 1 a 6

**Sessão 2 - Restaurante (30 min):**
- Testes 7 a 13

**Sessão 3 - Navegação e Edge Cases (20 min):**
- Testes 14 a 18

**Total:** ~1h30min de testes completos

---

## 💡 DICAS

- ✅ Use Ctrl+Shift+R para dar refresh completo (limpa cache)
- ✅ Mantenha o console aberto (F12) para ver erros
- ✅ Teste em modo anônimo/privado para garantir sessão limpa
- ✅ Use localStorage vazio entre testes críticos (F12 → Application → Clear storage)

---

## 🚀 PRONTO PARA BACKEND?

Quando todos os testes passarem:
- ✅ Frontend funciona 100% com mocks
- ✅ Todos os fluxos validados
- ✅ UX/UI aprovada
- ✅ **AÍ SIM** → Integrar com backend real!
