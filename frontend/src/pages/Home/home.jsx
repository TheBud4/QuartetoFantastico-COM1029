import "./style.css";
import Layout from "../../components/Layout";
import {
  Box,
  Boxes,
  Users,
  Package,
  ClipboardList,
  HandHeart,
  Send,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import api from "../../services/api";
import * as echarts from "echarts";

function Home() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const isAdmin = !!user?.admin;
  const [dashboard, setDashboard] = useState({
    voluntarios: 0,
    beneficiarios: 0,
    doacoes: 0,
    distribuicoes: 0,
    estoqueTotal: 0,
    itensBaixoEstoque: [],
  });
  const [loadingDash, setLoadingDash] = useState(false);
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const chartPieInstance = useRef(null);
  const chartBarInstance = useRef(null);

  const sections = [
    {
      title: "Gerenciar Itens",
      links: [
        { label: "Tipos", to: "/home/tipos", icon: Box },
        { label: "Tamanhos", to: "/home/tamanhos", icon: Boxes },
        { label: "Condições", to: "/home/condicoes", icon: ClipboardList },
        { label: "Itens", to: "/home/itens", icon: Package },
      ],
    },
    {
      title: "Gerenciar Doações",
      links: [
        { label: "Registrar doação", to: "/home/doacoes/nova", icon: HandHeart },
        { label: "Listar doações", to: "/home/doacoes", icon: ClipboardList },
      ],
    },
    {
      title: "Gerenciar Distribuições",
      links: [
        { label: "Registrar distribuição", to: "/home/distribuicoes/nova", icon: Send },
        { label: "Listar distribuições", to: "/home/distribuicoes", icon: ClipboardList },
      ],
    },
    {
      title: "Gerenciar Pessoas",
      links: [
        { label: "Beneficiários", to: "/home/beneficiarios", icon: Users },
        { label: "Voluntários", to: "/home/voluntarios", icon: Users },
      ],
    },
    ...(isAdmin
      ? [
          {
            title: "Administração",
            links: [
              { label: "Voluntários", to: "/home/voluntarios", icon: Users },
              { label: "Cartões", to: "/home/cartoes", icon: ClipboardList },
            ],
          },
        ]
      : []),
  ];

  const fetchDashboard = async () => {
    setLoadingDash(true);
    try {
      const { data } = await api.get("/dashboard", {
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
      });
      setDashboard(data);
    } catch {
      addToast("Não foi possível carregar o dashboard.", "error");
    } finally {
      setLoadingDash(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  useEffect(() => {
    const disposeCharts = () => {
      chartPieInstance.current?.dispose();
      chartBarInstance.current?.dispose();
    };
    disposeCharts();
    if (dashboard) {
      if (pieRef.current) {
        chartPieInstance.current = echarts.init(pieRef.current);
        chartPieInstance.current.setOption({
          tooltip: { trigger: "item" },
          legend: { bottom: 0 },
          series: [
            {
              type: "pie",
              radius: ["35%", "70%"],
              avoidLabelOverlap: false,
              label: { show: false },
              data: [
                { value: dashboard.voluntarios, name: "Voluntários" },
                { value: dashboard.beneficiarios, name: "Beneficiários" },
                { value: dashboard.doacoes, name: "Doações" },
                { value: dashboard.distribuicoes, name: "Distribuições" },
              ],
            },
          ],
        });
      }
      if (barRef.current) {
        chartBarInstance.current = echarts.init(barRef.current);
        const labels =
          dashboard.itensBaixoEstoque?.map(
            (i) =>
              `${i.tipo?.descricao ?? "-"} / ${i.tamanho?.descricao ?? "-"} / ${
                i.condicao?.descricao ?? "-"
              }`
          ) || [];
        const values = dashboard.itensBaixoEstoque?.map((i) => i.quantidadeEstoque) || [];
        chartBarInstance.current.setOption({
          tooltip: { trigger: "axis" },
          grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
          xAxis: { type: "value" },
          yAxis: { type: "category", data: labels },
          series: [
            {
              type: "bar",
              data: values,
              itemStyle: { color: "#084c61" },
            },
          ],
        });
      }
    }
    const onResize = () => {
      chartPieInstance.current?.resize();
      chartBarInstance.current?.resize();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      disposeCharts();
    };
  }, [dashboard]);

  const handleDownloadReport = async () => {
    try {
      const { data } = await api.get("/relatorios/movimentacoes", {
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
      });
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "relatorio-movimentacoes.json";
      a.click();
      URL.revokeObjectURL(url);
      addToast("Relatório baixado com sucesso.", "success");
    } catch {
      addToast("Não foi possível baixar o relatório.", "error");
    }
  };

  return (
    <Layout>
      <div className="home-page basetext-inter">
        <div className="dashboard-header">
          <h1 className="home-title destaque-archivo-black">Área do Sistema</h1>
          <button className="primary-button download-report" onClick={handleDownloadReport}>
            <Download size={16} />
            Baixar relatório
          </button>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <p>Voluntários</p>
            <h3>{dashboard.voluntarios}</h3>
          </div>
          <div className="metric-card">
            <p>Beneficiários</p>
            <h3>{dashboard.beneficiarios}</h3>
          </div>
          <div className="metric-card">
            <p>Doações</p>
            <h3>{dashboard.doacoes}</h3>
          </div>
          <div className="metric-card">
            <p>Distribuições</p>
            <h3>{dashboard.distribuicoes}</h3>
          </div>
          <div className="metric-card">
            <p>Estoque total</p>
            <h3>{dashboard.estoqueTotal}</h3>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-title">Panorama geral</div>
            <div className="chart-body" ref={pieRef}>
              {loadingDash && <p>Carregando...</p>}
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-title">Itens com menor estoque</div>
            <div className="chart-body" ref={barRef}>
              {loadingDash && <p>Carregando...</p>}
            </div>
          </div>
        </div>

        <div className="home-grid">
          {sections.map((section) => (
            <div key={section.title} className="home-section">
              <h2 className="section-title">{section.title}</h2>
              <div className="section-links">
                {section.links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.to} to={link.to} className="link-card basetext-inter">
                      <Icon size={22} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Home;
