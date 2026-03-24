"use client"
import { Activity, LayoutDashboard, Users, Search, Bell, CheckCircle2, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { COLORS, dataProducao, dataStatus } from '../data/data';

export default function Home() {
  
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-box">
            <Activity size={24} color="white" />
          </div>
          <span>SENAI | Tech</span>
        </div>
        <nav className="nav-list">
          <a href="#" className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item">
            <Activity size={20} />
            <span>Máquinas</span>
          </a>
          <a href="#" className="nav-item">
            <Users size={20} />
            <span>Equipa</span>
          </a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="search-box">
            <Search size={18}/>
            <input type="text" placeholder="Procurar dados" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Bell size={20} />
            <div style={{ background: '#3b82f6', color: 'white', padding: '5px 10px', borderRadius: '6px' }}>OP</div>
          </div>
        </header>

        <div className="content-area">
          <div style={{ marginBottom: '30px' }}>
            <h1>Painel de Controle</h1>
            <p style={{ color: '#64748b' }}>Monitorização da Linha de Montagem</p>
          </div>

          <div className="kpi-grid">
            {/* KPI Cards */}
            <div className="kpi-card">
              <div className="icon-wrapper" style={{ background: '#dcfce7' }}>
                <CheckCircle2 color="#10b981" />
              </div>
              <div className="kpi-info">
                <p>OEE Global</p>
                <h3>94.2%</h3>
              </div>
            </div>
            <div className="kpi-card">
              <div className="icon-wrapper" style={{ background: '#dbeafe' }}>
                <Activity color="#3b82f6" />
              </div>
              <div className="kpi-info">
                <p>Peças Hoje</p>
                <h3>1.240</h3>
              </div>
            </div>
            <div className="kpi-card">
              <div className="icon-wrapper" style={{ background: '#fef3c7' }}>
                <AlertCircle color="#f59e0b" />
              </div>
              <div className="kpi-info">
                <p>Alertas</p>
                <h3>03</h3>
              </div>
            </div>
            <div className="kpi-card">
              <div className="icon-wrapper" style={{ background: '#f3e8ff' }}>
                <AlertCircle color="#8b5cf6" />
              </div>
              <div className="kpi-info">
                <p>Tempo de ciclo</p>
                <h3>42s</h3>
              </div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="charts-card">
              <h3 className="charts-title">Desempenho por Turno</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataProducao}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="prod" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="charts-card">
              <h3 className="charts-title">Status da Frota</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataStatus}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dataStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}