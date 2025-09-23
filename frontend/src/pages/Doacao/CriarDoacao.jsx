import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import "./CriarDoacao.css";

const CriarDoacao = () => {
  const [itens, setItens] = useState([]);
  const [idItem, setIdItem] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [tipoMovimento, setTipoMovimento] = useState("entrada");
  const [mensagem, setMensagem] = useState(null);
  const navigate = useNavigate();

  const idVoluntario = 1; // substitua por valor dinâmico se necessário

  useEffect(() => {
    const carregarItens = async () => {
      try {
        const response = await api.get("/item");
        setItens(response.data);
      } catch (err) {
        console.error(err);
        setMensagem({ tipo: "erro", texto: "Erro ao carregar itens" });
      }
    };

    carregarItens();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Criar movimento
      const movimentoResponse = await api.post("/movimento", {
        data: new Date(),
        tipo: tipoMovimento,
        idVoluntario: 4,
        idBeneficiario: null, // adicione se necessário
      });
      const movimento = movimentoResponse.data;

      // 2. Criar itemMovimento
      await api.post("/item-movimento", {
        idItem,
        idMovimento: movimento.id,
        quantidade: Number(quantidade),
      });

      setMensagem({
        tipo: "sucesso",
        texto: "Movimentação registrada com sucesso!",
      });
      setTimeout(() => navigate("/estoque"), 1500);
    } catch (err) {
      console.error(err);
      setMensagem({
        tipo: "erro",
        texto: err.response?.data?.error || "Erro ao registrar movimentação",
      });
    }
  };

  return (
    <div className="estoque-container">
      <Sidebar />
      <main className="estoque-main">
        <div className="form-wrapper">
          <h2>Registrar Movimentação</h2>
          <form onSubmit={handleSubmit} className="formulario">
            <label>Tipo de Movimento *</label>
            <select
              value={tipoMovimento}
              onChange={(e) => setTipoMovimento(e.target.value)}
              required
            >
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>

            <label>Item *</label>
            <select
              value={idItem}
              onChange={(e) => setIdItem(e.target.value)}
              required
            >
              <option value="">Selecione um item</option>
              {itens.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.tipo} - {item.tamanho}
                </option>
              ))}
            </select>

            <label>Quantidade *</label>
            <input
              type="number"
              min={1}
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              required
            />

            <button type="submit" className="btn-criar">
              Registrar
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

export default CriarDoacao;
