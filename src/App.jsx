import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

function LoginPlaceholder() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Página de Login</h1>
      <p>O colega está a trabalhar nisto.</p>
      <br />
      <a href="/perfil" style={{ marginRight: '20px', color: 'blue' }}>Ir para Perfil</a>
      <a href="/register" style={{ color: 'blue' }}>Ir para Registo</a>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPlaceholder />} />

        <Route path="/register" element={<Register />} />

        <Route path="/perfil" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;