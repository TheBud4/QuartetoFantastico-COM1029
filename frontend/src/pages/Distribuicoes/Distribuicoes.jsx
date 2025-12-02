import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import { Search, RefreshCw, Eye, X } from "lucide-react";
import "./style.css";

export default function Distribuicoes() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [distribuicoes, setDistribuicoes] = useState([]);
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
      "Não foi possível carregar as distribuições.";
    addToast(message, "error");
  };

  const fetchDistribuicoes = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const { data } = await api.get("/distribuicoes", { headers });
      setDistribuicoes(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistribuicoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleString();
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return distribuicoes;
    return distribuicoes.filter((d) => {
      const itensStr =
        d.itens
          ?.map((i) => {
            const item = i.item || {};
            return `${item?.tipo?.descricao ?? ""} ${item?.tamanho?.descricao ?? ""} ${item?.condicao?.descricao ?? ""} ${i.quantidade ?? ""}`;
          })
          .join(" ")
          .toLowerCase() ?? "";
      const voluntario = `${d.voluntario?.nome ?? ""} ${d.voluntario?.email ?? ""}`.toLowerCase();
      const beneficiario = d.beneficiario?.nome?.toLowerCase?.() ?? "";
      const idStr = String(d.id ?? "");
      return itensStr.includes(term) || voluntario.includes(term) || beneficiario.includes(term) || idStr.includes(term);
    });
  }, [distribuicoes, search]);

  return (
    <Layout>
      <div className="dist-page basetext-inter">
        <div className="dist-header">
          <div>
            <h1 className="destaque-archivo-black">Distribuições</h1>
            <p>Listagem das distribuições realizadas</p>
          </div>
          <button className="ghost-button icon-only" onClick={fetchDistribuicoes} disabled={loading} title="Recarregar">
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
                placeholder="Buscar por beneficiário, item ou voluntário"
              />
            </div>
          </div>

          <div className="list-block">
            {loading ? (
              <p>Carregando...</p>
            ) : filtered.length === 0 ? (
              <p>Nenhuma distribuição encontrada.</p>
            ) : (
              <table className="dist-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Beneficiário</th>
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
                      <td>{d.beneficiario?.nome || "-"}</td>
                      <td>{d.voluntario?.nome || d.voluntario?.email || "-"}</td>
                      <td>{formatDate(d.createdAt)}</td>
                      <td>
                        <div className="itens-tags">
                          {d.itens?.map((i, idx) => {
                            const item = i.item || {};
                            const tagKey = i.id ?? `${d.id}-item-${idx}`;
                            return (
                              <span key={tagKey} className="tag-pill">
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
                  <h3 className="destaque-arquivo-black">Distribuição #{selected.id}</h3>
                  <p className="basetext-inter">
                    Beneficiário: {selected.beneficiario?.nome || "-"} | Voluntário: {selected.voluntario?.nome || selected.voluntario?.email || "-"} | Data: {formatDate(selected.createdAt)}
                  </p>
                </div>
                <button className="close-btn icon-only" onClick={() => setSelected(null)} title="Fechar">
                  <X size={18} />
                </button>
              </div>
              <div className="modal-content">
                <h4 className="basetext-inter">Itens</h4>
                <table className="dist-table inner">
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
