'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Bell, User, Clock, AlertTriangle, RefreshCcw,
  ShieldCheck, Cpu, LayoutDashboard, Inbox
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

/**
 * COMPONENTE PRINCIPAL: DashboardRobotica
 * Identificação: Painel de Controle da Célula
 */
export default function DashboardRobotica() {
  // --- [BLOCO 1: ESTADOS DE MEMÓRIA] ---
  const [time, setTime] = useState('--:--:--');
  const socketRef = useRef<WebSocket | null>(null);
  
  const [pecas, setPecas] = useState(0);
  const [ciclo, setCiclo] = useState(0);
  const [acerto, setAcerto] = useState(0);
  const [statusMaquina, setStatusMaquina] = useState("RUNNING");
  
  const [logs, setLogs] = useState<{time: string, text: string, color: string}[]>([
    { time: '--:--:--', text: "SISTEMA INICIALIZADO", color: "text-blue-400" }
  ]);

  const [histPecas, setHistPecas] = useState([{ pv: 0 }]);
  const [histCiclo, setHistCiclo] = useState([{ pv: 0 }]);

  const META_TOTAL = 1500;
  const eficiencia = ((pecas / META_TOTAL) * 100).toFixed(0);

  // --- [BLOCO 2: COMUNICAÇÃO DE SAÍDA (NEXT -> NODE-RED)] ---
  const enviarComando = (comando: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const msg = JSON.stringify({ action: comando });
      socketRef.current.send(msg);
      
      const logColor = comando === 'STOP' ? 'text-red-500' : 'text-yellow-400';
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('pt-BR'),
        text: `COMANDO ENVIADO: ${comando}`,
        color: logColor
      }, ...prev.slice(0, 14)]);
    }
  };

  // --- [BLOCO 3: COMUNICAÇÃO DE ENTRADA (NODE-RED -> NEXT)] ---
  useEffect(() => {
    // Relógio Local
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('pt-BR')), 1000);
    
    // Conexão WebSocket
    const socket = new WebSocket('ws://localhost:1880/ws/robotica');
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const currentTime = new Date().toLocaleTimeString('pt-BR');
        
        if (data.status) setStatusMaquina(data.status);

        if (data.pecas !== undefined) {
          setPecas(data.pecas);
          data.pecas === 0 ? setHistPecas([{ pv: 0 }]) : setHistPecas(prev => [...prev.slice(-15), { pv: data.pecas }]);
        }

        if (data.ciclo !== undefined) {
          setCiclo(data.ciclo);
          setHistCiclo(prev => [...prev.slice(-15), { pv: data.ciclo }]);
          
          if (data.status === "RUNNING") {
            setLogs(prev => [{
              time: currentTime,
              text: `PRODUÇÃO ATIVA - CICLO: ${data.ciclo}s`,
              color: data.ciclo > 4.0 ? "text-orange-400" : "text-emerald-400"
            }, ...prev.slice(0, 14)]);
          }
        }

        if (data.acerto !== undefined) setAcerto(data.acerto);

      } catch (error) {
        console.error("Erro no processamento de dados do CLP/Robô");
      }
    };

    socket.onerror = () => {
      setLogs(prev => [{ time: "ERRO", text: "SEM COMUNICAÇÃO COM NODE-RED", color: "text-red-600" }, ...prev]);
    };

    return () => {
      clearInterval(timer);
      socket.close();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5f9] text-slate-700 font-sans overflow-hidden text-sm">
      
      {/* --- [PARTE A: CABEÇALHO / HEADER] --- */}
      <header className="flex items-center justify-between px-8 h-20 bg-white border-b-2 border-slate-200 shadow-sm shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative w-12 h-12 bg-blue-50 rounded-2xl p-1.5 border border-blue-100">
             {/* Substitua pelo seu logo do SENAI */}
            <Image src="/robo.png" alt="Logo" fill className="object-contain p-1" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Célula Robótica - SENAI Tech</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Monitoramento Industrial</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Indicador de Status Visual */}
          <div className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase border-2 ${statusMaquina === 'RUNNING' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-red-50 border-red-200 text-red-600 animate-pulse'}`}>
             {statusMaquina}
          </div>

          <div className="flex items-center gap-4 bg-slate-900 px-6 py-2.5 rounded-2xl shadow-lg text-white">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-xl font-black font-mono tracking-widest">{time}</span>
          </div>
        </div>
      </header>

      {/* --- [PARTE B: CORPO DO DASHBOARD] --- */}
      <main className="flex flex-1 p-6 gap-6 overflow-hidden">
        
        {/* COLUNA ESQUERDA: KPIs (Peças, Ciclo, Qualidade) */}
        <div className="w-[28%] flex flex-col gap-4 overflow-y-auto pr-2">
          <MetricCard title="PRODUÇÃO TOTAL" icon={<Inbox size={20} className="text-slate-300"/>}>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-5xl font-black text-slate-900">{pecas}</span>
              <span className="text-slate-400 font-bold text-xl uppercase">un</span>
            </div>
            <MiniGraph color="#3b82f6" data={histPecas} />
          </MetricCard>

          <MetricCard title="TEMPO DE CICLO" icon={<Clock size={20} className="text-slate-300"/>}>
            <div className="flex items-baseline gap-2 mb-1">
              <span className={`text-5xl font-black ${ciclo > 4.0 ? 'text-red-500' : 'text-slate-900'}`}>{ciclo.toFixed(1)}s</span>
              {ciclo > 4.0 && <AlertTriangle size={20} className="text-red-500 animate-bounce" />}
            </div>
            <MiniGraph color={ciclo > 4.0 ? "#ef4444" : "#10b981"} data={histCiclo} />
          </MetricCard>

          <MetricCard title="QUALIDADE / ACERTO" icon={<ShieldCheck size={20} className="text-slate-300"/>}>
            <div className="text-5xl font-black text-slate-900">{acerto.toFixed(1)}%</div>
          </MetricCard>
        </div>

        {/* COLUNA CENTRAL: VISUALIZAÇÃO DO PROCESSO */}
        <div className="flex-1 bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col shadow-sm relative">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className={`w-full max-w-2xl aspect-video rounded-[2.5rem] flex items-center justify-center relative border-8 transition-all ${statusMaquina === 'RUNNING' ? 'bg-slate-900 border-slate-50' : 'bg-red-950 border-red-100'}`}>
                <Cpu size={80} className={`${statusMaquina === 'RUNNING' ? 'text-blue-500 animate-pulse' : 'text-red-600'}`} />
                {statusMaquina === 'STOPPED' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-600/20">
                    <span className="bg-red-600 text-white font-black text-4xl px-8 py-2 rounded-xl">EMERGÊNCIA</span>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: LOGS E CONTROLES */}
        <div className="w-[25%] flex flex-col gap-6">
          <div className="flex-1 bg-[#0f172a] rounded-3xl p-6 flex flex-col border-t-4 border-blue-500 shadow-xl overflow-hidden text-white font-mono text-[11px]">
             <div className="flex-1 overflow-y-auto space-y-3">
                {logs.map((log, index) => (
                  <LogEntry key={index} time={log.time} text={log.text} color={log.color} />
                ))}
             </div>
             
             {/* BOTÕES DE MANUTENÇÃO / OPERAÇÃO */}
             <div className="grid grid-cols-2 gap-3 mt-6">
               <button onClick={() => enviarComando('STOP')} className="bg-red-600 hover:bg-red-700 p-4 rounded-2xl flex flex-col items-center gap-1 font-black">
                 <AlertTriangle size={22} /><span className="text-[10px]">PARADA</span>
               </button>
               <button onClick={() => enviarComando('RESET')} className="bg-slate-800 hover:bg-slate-700 p-4 rounded-2xl flex flex-col items-center gap-1 font-black border border-slate-700">
                 <RefreshCcw size={22} /><span className="text-[10px]">RESET</span>
               </button>
             </div>
          </div>
        </div>
      </main>

      {/* --- [PARTE C: RODAPÉ / FOOTER] --- */}
      <footer className={`flex items-center h-16 text-white font-bold border-t-4 transition-colors ${statusMaquina === 'RUNNING' ? 'bg-[#0f172a] border-blue-500' : 'bg-red-950 border-red-600'}`}>
        <div className="px-10 flex items-center gap-4">
          <ShieldCheck size={24} className={statusMaquina === 'RUNNING' ? 'text-emerald-500' : 'text-red-500'} />
          <span className="text-lg italic font-black">{statusMaquina === 'RUNNING' ? 'SISTEMA OPERACIONAL' : 'CÉLULA BLOQUEADA'}</span>
        </div>
      </footer>
    </div>
  );
}

// --- [COMPONENTES DE APOIO (AUXILIARES)] ---

const MetricCard = ({ title, icon, children }: any) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-2 uppercase text-slate-400 font-black text-[11px]">
      <h3>{title}</h3>{icon}
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

const LogEntry = ({ time, text, color }: any) => (
  <div className="flex gap-3 border-b border-slate-800/40 pb-2">
    <span className="text-slate-500 font-black">[{time}]</span>
    <span className={`${color} font-bold uppercase`}>{text}</span>
  </div>
);