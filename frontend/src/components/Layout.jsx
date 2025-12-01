import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, LogOut } from "lucide-react";
import "./Layout.css";
import useAuth from "../hooks/useAuth";

function AccordionItem({ title, links }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="accordion-section basetext-inter">
      <button className="accordion-button" onClick={() => setOpen((o) => !o)}>
        <span>{title}</span>
        <span className={`accordion-icon ${open ? "open" : ""}`}>
          <ChevronRight size={18} />
        </span>
      </button>
      <div className={`accordion-panel ${open ? "open" : ""}`}>
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="accordion-link">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const userInitials = useMemo(
    () => (user?.email ? user.email[0].toUpperCase() : "?"),
    [user]
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = !!user?.admin;
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="right">
          <div className="user-menu-wrapper" ref={menuRef}>
            <button
              className="user-pill"
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <div className="user-info">
                <div className="user-avatar">{userInitials}</div>
                <span>{user?.email || "Usuário"}</span>
              </div>
            </button>
            {menuOpen && (
              <div className="user-menu" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={logout}
                  className="user-menu-item"
                >
                  <span>Sair</span>
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <aside className="app-sidebar ">
        <div className="sidebar-logo">
          <div className="sidebar-text destaque-archivo-black">SANEM</div>
        </div>
        <div className="accordion">
          <AccordionItem
            title="Cadastros"
            links={[
              { label: "Tipos", to: "/home/tipos" },
              { label: "Tamanhos", to: "/home/tamanhos" },
              { label: "Condições", to: "/home/condicoes" },
              { label: "Beneficiários", to: "/home/beneficiarios" },
              { label: "Voluntários", to: "/home/voluntarios" },
            ]}
          />
          <AccordionItem
            title="Doações"
            links={[
              { label: "Registrar doação", to: "/home/doacoes/nova" },
              { label: "Listar doações", to: "/home/doacoes" },
            ]}
          />
          <AccordionItem
            title="Distribuições"
            links={[
              {
                label: "Registrar distribuição",
                to: "/home/distribuicoes/nova",
              },
              { label: "Listar distribuições", to: "/home/distribuicoes" },
            ]}
          />
          {isAdmin && (
            <AccordionItem
              title="Administração"
              links={[
                { label: "Voluntários", to: "/home/voluntarios" },
                { label: "Cartões", to: "/home/cartoes" },
              ]}
            />
          )}
        </div>
      </aside>

      <main className="app-content">{children}</main>
    </div>
  );
}
