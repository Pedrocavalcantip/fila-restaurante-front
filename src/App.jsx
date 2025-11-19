import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginCliente from './paginas/LoginCliente';
import CadastroCliente from './paginas/CadastroCliente';
import RestaurantesDisponiveis from './paginas/RestaurantesDisponiveis';
import AcompanharFila from './paginas/AcompanharFila';
import LoginRestaurante from './paginas/LoginRestaurante';
import CadastroRestaurante from './paginas/CadastroRestaurante';
import PerfilCliente from './paginas/PerfilCliente';
import EntrarNaFila from './paginas/EntrarNaFila';

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
        {/* Redirecionar a home para a tela de login por enquanto */}
        <Route path="/" element={<Navigate to="/cliente/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;