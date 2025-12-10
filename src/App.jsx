import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EscolhaPerfil from './paginas/EscolhaPerfil';
import LoginCliente from './paginas/LoginCliente';
import CadastroCliente from './paginas/CadastroCliente';
import RestaurantesDisponiveis from './paginas/RestaurantesDisponiveis';
import AcompanharFila from './paginas/AcompanharFila';
import LoginRestaurante from './paginas/LoginRestaurante';
import CadastroRestaurante from './paginas/CadastroRestaurante';
import PerfilCliente from './paginas/PerfilCliente';
import EntrarNaFila from './paginas/EntrarNaFila';
import PainelAdministrativo from './paginas/PainelAdministrativo';
import PainelOperador from './paginas/PainelOperador';
import Gerenciamento from './paginas/Gerenciamento';
import GerenciamentoFilas from './paginas/GerenciamentoFilas';
import HistoricoTickets from './paginas/HistoricoTickets';
import DetalhesTicket from './paginas/DetalhesTicket';
import PainelPublico from './paginas/PainelPublico';
import ConfiguracoesRestaurante from './paginas/ConfiguracoesRestaurante';
import HistoricoClienteTickets from './paginas/HistoricoClienteTickets';
import Dashboard from './paginas/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tela inicial de escolha de perfil */}
        <Route path="/" element={<EscolhaPerfil />} />
        {/* Tela de login do cliente */}
        <Route path="/cliente/login" element={<LoginCliente />} />
        {/* Tela de cadastro do cliente */}
        <Route path="/cliente/cadastro" element={<CadastroCliente />} />
        {/* Tela de restaurantes disponíveis */}
        <Route path="/cliente/restaurantes" element={<RestaurantesDisponiveis />} />
        {/* Tela de acompanhar fila */}
        <Route path="/cliente/meu-ticket" element={<AcompanharFila />} />
        {/* Tela de perfil do cliente */}
        <Route path="/cliente/perfil" element={<PerfilCliente />} />
        {/* Tela de entrar na fila */}
        <Route path="/cliente/restaurante/:slug/entrar-fila" element={<EntrarNaFila />} />
        {/* Tela de login do restaurante */}
        <Route path="/restaurante/login" element={<LoginRestaurante />} />
        {/* Tela de cadastro do restaurante */}
        <Route path="/restaurante/cadastro" element={<CadastroRestaurante />} />
        {/* Painel administrativo do restaurante */}
        <Route path="/restaurante/painel" element={<PainelAdministrativo />} />
        {/* Gerenciamento de equipe e filas */}
        <Route path="/restaurante/gerenciamento" element={<Gerenciamento />} />
        {/* Gerenciamento de filas */}
        <Route path="/restaurante/gerenciamento/filas" element={<GerenciamentoFilas />} />
        {/* Painel do operador - Fila ao Vivo */}
        <Route path="/restaurante/painel-operador" element={<PainelOperador />} />
        {/* Histórico de Tickets do Operador */}
        <Route path="/restaurante/historico-tickets" element={<HistoricoTickets />} />
        {/* Detalhes do Ticket */}
        <Route path="/restaurante/ticket/:ticketId" element={<DetalhesTicket />} />
        {/* Painel Público (TV) */}
        <Route path="/publico/painel" element={<PainelPublico />} />
        {/* Configurações do Restaurante */}
        <Route path="/restaurante/configuracoes" element={<ConfiguracoesRestaurante />} />
        {/* Histórico de Tickets do Cliente */}
        <Route path="/cliente/historico" element={<HistoricoClienteTickets />} />
        {/* Dashboard de Estatísticas */}
        <Route path="/restaurante/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;