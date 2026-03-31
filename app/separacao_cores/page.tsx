'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Bell, User, Clock, AlertTriangle, RefreshCcw,
  ShieldCheck, Cpu, LayoutDashboard, Inbox
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function DashboardRobotica() {
  const [time, setTime] = useState('--:--:--');
  
  // --- ESTADOS EM TEMPO REAL ---
  const [pecas, setPecas] = useState(1248);
  const [ciclo, setCiclo] = useState(4.2);
  const [acerto, setAcerto] = useState(98.5);
  
  // Histórico para os gráficos (faz a linha se mover)
  const [histPecas, setHistPecas] = useState([{ pv: 1100 }, { pv: 1150 }, { pv: 1180 }, { pv: 1248 }]);
  const [histCiclo, setHistCiclo] = useState([{ pv: 4.5 }, { pv: 4.0 }, { pv: 4.2 }, { pv: 4.1 }]);

  // --- CONFIGURAÇÕES DE META ---
  const META_TOTAL = 1500;
  const eficiencia = ((pecas / META_TOTAL) * 100).toFixed(0);

  useEffect(() => {
    // Relógio
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('pt-BR')), 1000);
    
    // Conexão WebSocket - Usando localhost para evitar conflitos de IP
    const socket = new WebSocket('ws://localhost:1880/ws/robotica');

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.pecas !== undefined) {
          setPecas(data.pecas);
          setHistPecas(prev => [...prev.slice(-10), { pv: data.pecas }]); // Mantém os últimos 10 pontos
        }
        if (data.ciclo !== undefined) {
          setCiclo(data.ciclo);
          setHistCiclo(prev => [...prev.slice(-10), { pv: data.ciclo }]);
        }
        if (data.acerto !== undefined) setAcerto(data.acerto);

      } catch (error) {
        console.error("Erro ao processar dados do Node-RED:", error);
      }
    };

    socket.onerror = () => console.error("Erro na conexão WebSocket");

    return () => {
      clearInterval(timer);
      socket.close();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5f9] text-slate-700 font-sans overflow-hidden text-sm">
      
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 h-20 bg-white border-b-2 border-slate-200 shadow-sm shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative w-12 h-12 bg-blue-50 rounded-2xl p-1.5 border border-blue-100">
            <Image src="/robo.png" alt="Logo" fill className="object-contain p-1" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Célula Robótica - SENAI Tech</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Monitoramento em Tempo Real</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-slate-900 px-6 py-2.5 rounded-2xl border border-slate-700 shadow-lg">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-xl font-black font-mono text-white tracking-widest">{time}</span>
          </div>
          <div className="flex gap-2">
            <HeaderButton icon={<Bell size={22} />} badge />
            <HeaderButton icon={<User size={22} />} className="bg-blue-600 text-white" />
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex flex-1 p-6 gap-6 overflow-hidden min-h-0">
        
        <div className="w-[28%] flex flex-col gap-4 overflow-y-auto pr-2">
          {/* PEÇAS */}
          <MetricCard title="PEÇAS PROCESSADAS" icon={<Inbox size={20} className="text-slate-300"/>}>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-5xl font-black text-slate-900 tracking-tighter">{pecas.toLocaleString('pt-BR')}</span>
              <span className="text-slate-400 font-bold text-xl">un</span>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase mb-3">
              <span>Meta: {META_TOTAL.toLocaleString('pt-BR')}</span>
              <span>Eficiência: {eficiencia}%</span>
            </div>
            <MiniGraph color="#3b82f6" data={histPecas} />
          </MetricCard>

          {/* CICLO */}
          <MetricCard title="TEMPO DE CICLO (S)" icon={<Clock size={20} className="text-slate-300"/>}>
            <div className="flex items-baseline gap-2 mb-1">
              <span className={`text-5xl font-black tracking-tighter ${ciclo > 4.0 ? 'text-red-500' : 'text-slate-900'}`}>
                {ciclo.toFixed(1)}
              </span>
              <span className={`${ciclo > 4.0 ? 'text-red-500' : 'text-slate-400'} font-bold text-xl uppercase`}>s</span>
              {ciclo > 4.0 && <AlertTriangle size={20} className="text-red-500 animate-bounce ml-1" />}
            </div>
            <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase mb-3">
              <span>Min: 3.5s</span>
              <span>Max: 4.0s</span>
            </div>
            <MiniGraph color={ciclo > 4.0 ? "#ef4444" : "#3b82f6"} data={histCiclo} />
          </MetricCard>

          {/* ACERTO */}
          <MetricCard title="TAXA DE ACERTO (%)" icon={<ShieldCheck size={20} className="text-slate-300"/>}>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-5xl font-black text-slate-900 tracking-tighter">{acerto.toFixed(1)}</span>
              <span className="text-slate-400 font-bold text-xl">%</span>
            </div>
            <div className="h-[14px]" />
            <MiniGraph color="#64748b" data={histPecas} />
          </MetricCard>
        </div>

        {/* CENTRO - CÂMERA */}
        <div className="flex-1 bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col shadow-sm relative text-center">
          <h3 className="text-xs font-black text-slate-400 tracking-widest uppercase mb-6 flex items-center justify-center gap-2">
            <LayoutDashboard size={16} className="text-blue-500" /> Monitoramento de Célula
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl aspect-video bg-slate-900 rounded-[2.5rem] flex items-center justify-center relative border-8 border-slate-50 shadow-2xl overflow-hidden">
               <Cpu size={80} className="text-blue-500/10 animate-pulse" />
               <div className="absolute top-8 right-8 flex items-center gap-2 bg-red-600 px-4 py-1.5 rounded-full shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                  <span className="text-white text-[10px] font-black uppercase">Live Feed</span>
               </div>
            </div>
          </div>
        </div>

        {/* DIREITA - KPI */}
        <div className="w-[25%] flex flex-col gap-6">
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 tracking-widest uppercase mb-4 italic">Status de Linha</h3>
            <KpiBar label="OEE Global" value={eficiencia} color="bg-blue-500" />
            <KpiBar label="Saúde de Ativos" value={99} color="bg-slate-900" />
          </div>

          <div className="flex-1 bg-[#0f172a] rounded-3xl p-6 flex flex-col border-t-4 border-blue-500 shadow-xl overflow-hidden">
            <div className="flex-1 overflow-y-auto font-mono text-[11px] space-y-3 scrollbar-hide">
               <LogEntry time={time} text="CONEXÃO ESTÁVEL" color="text-emerald-400" />
               <LogEntry time="SISTEMA" text="AGUARDANDO NODE-RED..." color="text-blue-400" />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl flex flex-col items-center justify-center gap-1 font-black transition-all active:scale-95 shadow-lg">
                <AlertTriangle size={22} />
                <span className="text-[10px] uppercase">Parada</span>
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl flex flex-col items-center justify-center gap-1 font-black border border-slate-700 transition-all active:scale-95 shadow-lg">
                <RefreshCcw size={22} />
                <span className="text-[10px] uppercase">Reset</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0f172a] text-white flex items-center h-16 text-xs font-bold border-t-4 border-blue-500 shrink-0 mt-auto">
        <div className="w-[450px] shrink-0 h-full" />
        <div className="w-[280px] bg-red-600 h-full flex items-center px-10 gap-4 z-10 shrink-0">
          <AlertTriangle size={24} className="animate-pulse" /> 
          <span className="text-lg italic font-black uppercase">Erro</span>
        </div>
        <div className="flex-1 flex justify-center items-center font-mono px-8 text-center uppercase tracking-wider">
            <span className="text-red-400 font-black mr-3">[301]</span>
            <span className="truncate">Obstrução detectada: Verifique a esteira J2</span>
        </div>
        <div className="w-[500px] flex items-center justify-center h-full px-8 gap-12 border-l border-slate-800 bg-slate-900/40 shrink-0">
          <StatusIndicator label="ROBÔ" status="REMOTO" color="bg-green-500" />
          <StatusIndicator label="PLC" status="RUN" color="bg-green-500" />
        </div>
      </footer>
    </div>
  );
}

// SUBCOMPONENTES
const MetricCard = ({ title, icon, children }: any) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col shrink-0">
    <div className="flex justify-between items-start mb-2 uppercase text-slate-400 font-black text-[11px]">
      <h3>{title}</h3>
      {icon}
    </div>
    {children}
  </div>
);

const MiniGraph = ({ color, data }: any) => (
  <div className="h-14 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line type="monotone" dataKey="pv" stroke={color} strokeWidth={3} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const HeaderButton = ({ icon, badge, className = "" }: any) => (
  <button className={`p-3 rounded-xl border border-slate-100 relative ${className}`}>
    {icon}
    {badge && <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />}
  </button>
);

const KpiBar = ({ label, value, color }: any) => (
  <div className="mb-4 last:mb-0 uppercase font-black">
    <div className="flex justify-between text-[10px] mb-1.5 text-slate-500">
      <span>{label}</span>
      <span className="text-slate-900">{value}%</span>
    </div>
    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
      <div className={`h-full ${color} transition-all duration-700`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

const LogEntry = ({ time, text, color }: any) => (
  <div className="flex gap-3 border-b border-slate-800/40 pb-2">
    <span className="text-slate-500 font-black">[{time}]</span>
    <span className={`${color} font-bold uppercase`}>{text}</span>
  </div>
);

const StatusIndicator = ({ label, status, color }: any) => (
  <div className="flex items-center gap-3 font-black">
    <span className="text-slate-500 text-[10px] uppercase tracking-widest">{label}</span>
    <div className="flex items-center gap-2 bg-slate-800 px-4 py-1.5 rounded-xl border border-slate-700 shadow-inner">
      <div className={`w-2 h-2 ${color} rounded-full`} />
      <span className="text-white text-[11px] uppercase">{status}</span>
    </div>
  </div>
);