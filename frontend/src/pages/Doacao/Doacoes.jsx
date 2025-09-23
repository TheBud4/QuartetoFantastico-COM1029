import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import necessário
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import "./Doacoes.css";

const Doacoes = () => {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ hook de navegação

  const fetchItens = async () => {
    try {
      setLoading(true);
      const response = await api.get("/itemMovimento");
      const doacoes = response.data.filter(
        (item) => item.movimento?.tipo === "doacao"
      );
      setItens(doacoes);
    } catch (error) {
      console.error("Erro ao buscar itens de doação:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItens();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;

    try {
      await api.delete(`/itemMovimento/${id}`);
      await fetchItens();
    } catch (error) {
      console.error("Erro ao deletar item:", error);
      alert("Não foi possível excluir o item.");
    }
  };

  return (
    <div className="estoque-container">
      <Sidebar />
      <main className="estoque-main">
        <h2>Itens de Doação</h2>
        <button
          className="adicionar-btn"
          onClick={() => navigate("/criarDoacao")}
        >
          + Adicionar Doação
        </button>

        {loading ? (
          <p>Carregando...</p>
        ) : itens.length === 0 ? (
          <p>Nenhum item de doação encontrado.</p>
        ) : (
          <ul className="lista-itens">
            {itens.map((item) => (
              <li key={item.id}>
                <strong>{item.tipo}</strong> - {item.tamanho} -{" "}
                {item.quantidade} unidades
                <button onClick={() => handleDelete(item.id)}>Excluir</button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Doacoes;
