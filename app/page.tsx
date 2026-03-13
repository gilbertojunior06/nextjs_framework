
import { Activity, LayoutDashboard, Users, Search, Bell } from "lucide-react";

export default function Home() {
  
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-box">
            <Activity size={24}/>
          </div>
          <span>SENAI | Tech</span>
        </div>
        <nav className="nav-list">
          <a href="#" className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item active">
            <Activity size={20} />
            <span>Máquinas</span>
          </a>
          <a href="#" className="nav-item active">
            <Users size={20} />
            <span>Equipa</span>
          </a>
        </nav>
      </aside>
      <main className="main-content">
        <header className="header">
          <div className="search-box">
            <Search size={18}/>
            <input type="text" placeholder="Procurar dados" id="" />
          </div>
          <div>
            <Bell size={20} />
            <div>
              OP
            </div>
          </div>
        </header>
      </main>
    </div>
  );
}
