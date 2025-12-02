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
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Home() {
  const { user } = useAuth();
  const isAdmin = !!user?.admin;

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

  return (
    <Layout>
      <div className="home-page basetext-inter">
        <h1 className="home-title destaque-archivo-black">Área do Sistema</h1>
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
