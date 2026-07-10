import { useAuth } from '../contexts/AuthContext.jsx'

function AppLayout({ children, active = 'inicio', onNavigate }) {
  const { usuario, logout } = useAuth()

  const menuItems = [
    { id: 'inicio', label: 'Início', icon: '⌂' },
    { id: 'ordens', label: 'Ordens de Serviço', icon: '▣' },
    { id: 'clientes', label: 'Clientes', icon: '♙' },
    { id: 'veiculos', label: 'Veículos', icon: '◈' },
    { id: 'funcionarios', label: 'Funcionários', icon: '◎' },
    { id: 'pecas', label: 'Peças', icon: '⚙' },
    { id: 'servicos', label: 'Serviços', icon: '★' },
    { id: 'estoque', label: 'Estoque', icon: '▥' },
    { id: 'relatorios', label: 'Relatórios', icon: '▧' },
  ]

  return (
    <main className="app-page">
      <section className="app-card">
        <header className="app-header">
          <h1>Agili<span>Car</span></h1>
          <div className="header-user-info">
            <span className="header-user-name">{usuario?.nomeUsuario}</span>
            <span className="header-user-role">{usuario?.perfil}</span>
          </div>
        </header>

        <div className="app-body">
          <aside className="sidebar">
            <nav>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`sidebar-item ${active === item.id ? 'active' : ''}`}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            <button className="sidebar-item logout" type="button" onClick={logout}>
              <span>↩</span>
              Sair
            </button>
          </aside>

          <section className="content-area">{children}</section>
        </div>
      </section>
    </main>
  )
}

export default AppLayout
