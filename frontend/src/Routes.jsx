import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/index";
import Estoque from "./pages/Estoque/Estoque_M";
import CriarItem from "./pages/Estoque/CriarItem";

// 🆕 Importações para doações
import Doacoes from "./pages/Doacao/Doacoes";
import CriarDoacao from "./pages/Doacao/CriarDoacao";

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/criarItem" element={<CriarItem />} />

        {/* 🆕 Rotas de doações */}
        <Route path="/doacao" element={<Doacoes />} />
        <Route path="/criarDoacao" element={<CriarDoacao />} />
      </Routes>
    </Router>
  );
}
