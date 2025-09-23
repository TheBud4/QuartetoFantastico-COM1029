import { Link } from "react-router-dom";
import "./HeaderNav.css";

function HeaderNav() {
  const menuItems = [
    { to: "/", label: "Início" },
    { to: "/estoque", label: "Estoque" },
    { to: "/doacoes", label: "Doações" },
    { to: "/retiradas", label: "Retiradas" },
    { to: "/beneficiarios", label: "Beneficiários" },
    { to: "/relatorios", label: "Relatórios" },
  ];

  return (
    <header className="header-nav">
      <h1>SANEM</h1>
      <nav>
        <ul className="nav-links">
          {menuItems.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="redirects-button">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default HeaderNav;
