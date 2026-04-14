"use client"
import { Activity, LayoutDashboard, Users, Search, Bell, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { COLORS, dataProducao, dataStatus, maquinas } from '../data/data'
import { useState, useEffect } from "react";
import Link from 'next/link';

// Definindo a interface para evitar erros de "never[]"
interface Maquina {
  id: number;
  nome: string;
  consumo: number;
  status: string;
}

export default function Home() {
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(false);
  // Corrigido: Agora o TS sabe que resultado é um array de Maquina
  const [resultado, setResultado] = useState<Maquina[]>([]);

  // Função de filtro
  const filtrarMaquinasPorNome = () => {
    return maquinas.filter((item) => 
      item.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      const dados_filtrados = filtrarMaquinasPorNome();
      setResultado(dados_filtrados);
      setLoading(false);
    }, 500); 

    return () => clearTimeout(timeout);
  }, [busca]);

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
          <Link href="/" className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard </span>
          </Link>

          <Link href="/separacao_cores" className="nav-item">
            <Activity size={20} />
            <span>Separação Cores</span>
          </Link>

          <Link href="/robo" className="nav-item">
            <Activity size={20} />
            <span>Robo LAB12</span>
          </Link>

          <a href="#" className="nav-item">
            <Users size={20} />
            <span>Equipe</span>
          </a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex items-center gap-4">
             <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                <ArrowLeft size={18} />
                <span>Voltar</span>
             </Link>

             <div className="search-box" style={{ marginLeft: '20px' }}>
                <Search size={18}/>
                <input 
                  type="text" 
                  placeholder="Procurar dados..." 
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
             </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Bell size={20} style={{ color: '#64748b', cursor: 'pointer' }} />
            <div style={{ background: '#3b82f6', color: 'white', padding: '5px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>
              OP
            </div>
          </div>
        </header>

        <div className="content-area">
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Painel de Controle</h1>
            <p style={{ color: '#64748b' }}>Monitorização da Linha de Montagem</p>
          </div>

          {/* Cards KPI */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="icon-wrapper" style={{ background: '#dcfce7'}}>
                <CheckCircle2 color="#10b981" />
              </div>
              <div className="kpi-info">
                <p>OEE Global</p>
                <h3>94.2%</h3>
              </div>
            </div>
            <div className="kpi-card">
              <div className="icon-wrapper" style={{ background: '#dbeafe'}}>
                <Activity color="#3b82f6" />
              </div>
              <div className="kpi-info">
                <p>Peças Hoje</p>
                <h3>1.240</h3>
              </div>
            </div>
            <div className="kpi-card">
              <div className="icon-wrapper" style={{ background: '#fef3c7'}}>
                <AlertCircle color="#f59e0b" />
              </div>
              <div className="kpi-info">
                <p>Alertas</p>
                <h3>03</h3>
              </div>               
            </div>
            <div className="kpi-card">
              <div className="icon-wrapper" style={{ background: '#f3e8ff'}}>
                <AlertCircle color="#8b5cf6" />
              </div>
              <div className="kpi-info">
                <p>Tempo de ciclo</p>
                <h3>42s</h3>
              </div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h3 className="chart-title">
                {busca !== '' ? 'Resultados da Pesquisa' : 'Desempenho por Turno'}
              </h3>
              <div style={{ height: '300px'}}>
                { busca !== '' ? (
                  <div style={{ height: '100%', overflowY: 'auto'}}>
                    {loading ? (
                       <p style={{ color: '#3b82f6', padding: '20px' }}>Buscando Dados...</p>
                    ) : (
                      <table style={{ width:'100%', textAlign:'left', borderCollapse: 'collapse'}}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px' }}>
                            <th style={{ padding: '12px 8px'}}>Máquina</th>
                            <th style={{ padding: '12px 8px'}}>Consumo</th>
                            <th style={{ padding: '12px 8px'}}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Ajustado: Usando 'resultado' em vez de 'maquinasFiltradas' para respeitar o loading */}
                          {resultado.map((maquina) => (
                            <tr key={maquina.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                              <td style={{ padding: '12px 8px', fontWeight: '500' }}>{maquina.nome}</td>
                              <td style={{ padding: '12px 8px' }}>{maquina.consumo}</td>
                              <td style={{ padding: '12px 8px' }}>
                                <span style={{ 
                                  padding: '4px 8px', 
                                  borderRadius: '4px', 
                                  fontSize: '11px',
                                  background: maquina.status === 'ativo' ? '#dcfce7' : '#fee2e2',
                                  color: maquina.status === 'ativo' ? '#166534' : '#991b1b'
                                }}>
                                  {maquina.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {!loading && resultado.length === 0 && (
                      <p style={{ color: '#ef4444', padding: '20px' }}>Nenhuma máquina encontrada.</p>
                    )}
                  </div>
                ) : (
                  <ResponsiveContainer width={"100%"} height={"100%"}>
                    <BarChart data={dataProducao}>
                      <CartesianGrid strokeDasharray={"3 3"} vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey={"name"} axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc'}} />
                      <Bar dataKey={"prod"} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}                
              </div>
            </div>

            <div className="chart-card">
              <h3 className="chart-title">Status da Frota</h3>
              <div style={{height: '300px'}}>
                <ResponsiveContainer width={"100%"} height={"100%"} >
                  <PieChart>
                    <Pie
                      data={dataStatus}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey={"value"}
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