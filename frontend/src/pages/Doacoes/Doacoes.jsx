import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import { Search, RefreshCw, Eye, X } from "lucide-react";
import "./style.css";

export default function Doacoes() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [doacoes, setDoacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const headers = useMemo(
    () => (user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
    [user?.token]
  );

  const handleApiError = (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Não foi possível carregar as doações.";
    addToast(message, "error");
  };

  const fetchDoacoes = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const { data } = await api.get("/doacoes", { headers });
      setDoacoes(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoacoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleString();
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return doacoes;
    return doacoes.filter((d) => {
      const itensStr =
        d.itens
          ?.map((i) => {
            const item = i.item || {};
            return `${item?.tipo?.descricao ?? ""} ${item?.tamanho?.descricao ?? ""} ${item?.condicao?.descricao ?? ""} ${i.quantidade ?? ""}`;
          })
          .join(" ")
          .toLowerCase() ?? "";
      const voluntario = `${d.voluntario?.nome ?? ""} ${d.voluntario?.email ?? ""}`.toLowerCase();
      const idStr = String(d.id ?? "");
      return itensStr.includes(term) || voluntario.includes(term) || idStr.includes(term);
    });
  }, [doacoes, search]);

  return (
    <Layout>
      <div className="doacoes-page basetext-inter">
        <div className="doacoes-header">
          <div>
            <h1 className="destaque-archivo-black">Doações</h1>
            <p>Listagem das doações registradas</p>
          </div>
          <button className="ghost-button icon-only" onClick={fetchDoacoes} disabled={loading} title="Recarregar">
            <RefreshCw size={16} />
          </button>
        </div>

        <section className="endpoint-card">
          <div className="list-actions">
            <div className="search-input">
              <Search size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por voluntário, item ou ID"
              />
            </div>
          </div>

          <div className="list-block">
            {loading ? (
              <p>Carregando...</p>
            ) : filtered.length === 0 ? (
              <p>Nenhuma doação encontrada.</p>
            ) : (
              <table className="doacoes-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Voluntário</th>
                    <th>Data</th>
                    <th>Itens</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>{d.voluntario?.nome || d.voluntario?.email || "-"}</td>
                      <td>{formatDate(d.createdAt)}</td>
                      <td>
                        <div className="itens-tags">
                          {d.itens?.map((i) => {
                            const item = i.item || {};
                            return (
                              <span key={i.id} className="tag-pill">
                                {item.tipo?.descricao ?? "Tipo"} / {item.tamanho?.descricao ?? "Tam"} / {item.condicao?.descricao ?? "Cond"} — {i.quantidade}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="actions">
                        <button
                          className="icon-button view"
                          title="Ver detalhes"
                          onClick={() => setSelected(d)}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {selected && (
          <div
            className="modal-backdrop"
            onClick={() => setSelected(null)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3 className="destaque-archivo-black">Doação #{selected.id}</h3>
                  <p className="basetext-inter">
                    Voluntário: {selected.voluntario?.nome || selected.voluntario?.email || "-"} | Data: {formatDate(selected.createdAt)}
                  </p>
                </div>
                <button className="close-btn icon-only" onClick={() => setSelected(null)} title="Fechar">
                  <X size={18} />
                </button>
              </div>
              <div className="modal-content">
                <h4 className="basetext-inter">Itens</h4>
                <table className="doacoes-table inner">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Tamanho</th>
                      <th>Condição</th>
                      <th>Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.itens?.map((i, idx) => {
                      const item = i.item || {};
                      return (
                        <tr key={i.id ?? `${selected.id}-item-${idx}`}>
                          <td>{item.tipo?.descricao ?? "-"}</td>
                          <td>{item.tamanho?.descricao ?? "-"}</td>
                          <td>{item.condicao?.descricao ?? "-"}</td>
                          <td>{i.quantidade}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
