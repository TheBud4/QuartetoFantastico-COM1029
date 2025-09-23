import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import "./CriarItem.css";

const CriarItem = () => {
  const [tipo, setTipo] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [mensagem, setMensagem] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/item", {
        tipo,
        tamanho,
        quantidade: quantidade ? Number(quantidade) : 0,
      });

      setMensagem({
        tipo: "sucesso",
        texto: `Item criado: ${response.data.tipo}`,
      });

      setTimeout(() => {
        navigate("/estoque");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMensagem({
        tipo: "erro",
        texto: err.response?.data?.error || "Erro ao criar item",
      });
    }
  };

  return (
    <div className="estoque-container">
      <Sidebar />
      <main className="estoque-main">
        <div className="form-wrapper">
          <h2>Registrar Novo Item</h2>
          <form onSubmit={handleSubmit} className="formulario">
            <label>Tipo *</label>
            <input
              type="text"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            />

            <label>Tamanho</label>
            <input
              value={tamanho}
              onChange={(e) => setTamanho(e.target.value)}
            />

            <label>Quantidade</label>
            <input
              type="number"
              min={0}
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
            />

            <button type="submit" className="btn-criar">
              Criar
            </button>

            {mensagem && (
              <p className={mensagem.tipo === "erro" ? "erro" : "sucesso"}>
                {mensagem.texto}
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default CriarItem;
