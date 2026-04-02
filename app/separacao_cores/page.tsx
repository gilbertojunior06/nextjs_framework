'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  User, Clock, AlertTriangle, ArrowLeft,
  Cpu, LayoutDashboard, Inbox, CheckCircle, XCircle 
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const INITIAL_CHART_DATA = [
  { pv: 10 }, { pv: 15 }, { pv: 8 }, { pv: 12 }, { pv: 20 }, 
  { pv: 14 }, { pv: 10 }, { pv: 18 }, { pv: 12 }, { pv: 15 }
];

interface MetricProps {
  title: string;
  value: string | number;
  unit: string;
  sub: string;
  meta?: string;
  color: string;
  alert?: boolean;
  data: { pv: number }[];
}

interface CircleProps {
  bg: string;
  count: number;
  label: string;
  active: boolean;
  icon?: React.ReactNode;
}

interface ProgressProps {
  label: string;
  value: number;
  color: string;
}

export default function DashboardRobotica() {
  const [time, setTime] = useState('--:--:--');
  const socketRef = useRef<WebSocket | null>(null);
  
  const [pecas, setPecas] = useState(1248);
  const [ciclo, setCiclo] = useState(4.2);
  const [acerto, setAcerto] = useState("98.5%");
  const [statusMaquina, setStatusMaquina] = useState("RUNNING");
  
  const [contagemCores, setContagemCores] = useState({ preto: 0, verde: 0, cinza: 0, erros: 0 });
  const [deteccaoAtiva, setDeteccaoAtiva] = useState(""); 

  const [logs, setLogs] = useState<{time: string, text: string, color: string, border: string}[]>([
    { time: '21:33:38', text: "PEÇA AGUARDANDO... DETECTADA", color: "text-blue-600", border: "border-blue-500" },
    { time: '21:33:30', text: "SISTEMA ONLINE", color: "text-emerald-600", border: "border-emerald-500" }
  ]);

  const histPecas = useMemo(() => INITIAL_CHART_DATA, []);

  const handleBack = () => {
    window.location.href = '/'; 
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('pt-BR')), 1000);
    const socket = new WebSocket('ws://localhost:1880/ws/robot');
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const currentTime = new Date().toLocaleTimeString('pt-BR');
        
        if (data.status_robo) setStatusMaquina(data.status_robo);
        if (data.total_pecas !== undefined) setPecas(data.total_pecas);
        if (data.total_falhas !== undefined) setContagemCores(p => ({...p, erros: data.total_falhas}));
        if (data.taxa_acerto !== undefined) setAcerto(data.taxa_acerto);
        if (data.tempo_ciclo !== undefined) setCiclo(data.tempo_ciclo);

        if (data.ultimo_log) {
          const txt = data.ultimo_log.toLowerCase();
          let corLog = "text-slate-600";
          let bordaLog = "border-slate-300";
          
          if (txt.includes("preto")) { 
            setContagemCores(p => ({...p, preto: p.preto + 1})); 
            setDeteccaoAtiva("preto"); 
            corLog = "text-black font-black"; 
            bordaLog = "border-black";
          } else if (txt.includes("verde")) { 
            setContagemCores(p => ({...p, verde: p.verde + 1})); 
            setDeteccaoAtiva("verde"); 
            corLog = "text-emerald-600 font-bold";
            bordaLog = "border-emerald-500";
          } else if (txt.includes("cinza")) { 
            setContagemCores(p => ({...p, cinza: p.cinza + 1})); 
            setDeteccaoAtiva("cinza"); 
            corLog = "text-slate-500 font-bold";
            bordaLog = "border-slate-400";
          } else if (txt.includes("erro") || txt.includes("falha")) {
            setDeteccaoAtiva("erro");
            corLog = "text-red-600 font-black animate-pulse";
            bordaLog = "border-red-600";
          }

          setLogs(prev => [{ 
            time: currentTime, 
            text: data.ultimo_log.toUpperCase(), 
            color: corLog,
            border: bordaLog
          }, ...prev.slice(0, 10)]);
        }
      } catch (e) { console.error("Erro WebSocket:", e); }
    };

    return () => { 
      clearInterval(timer); 
      if (socketRef.current) socketRef.current.close(); 
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5f9] text-slate-700 font-sans overflow-hidden text-sm">
      
      <header className="flex items-center justify-between px-8 h-20 bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-10">
        <div className="flex items-center gap-6">
          {/* BOTÃO VOLTAR COM LABEL */}
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 px-4 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all border border-slate-200 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-black text-[11px] tracking-widest">VOLTAR</span>
          </button>

          <div className="flex items-center gap-4 border-l-2 border-slate-100 pl-6">
            <Cpu size={36} className="text-blue-600" />
            <div>
              <h1 className="text-xl font-black text-[#0f172a] tracking-tight uppercase leading-none">Célula Robótica - SENAI | Tech</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Painel de Controle e Monitoramento</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-[#0f172a] px-6 py-2 rounded-full text-white flex items-center gap-3 border-2 border-blue-500/30">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-2xl font-black font-mono">{time}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-1 pr-4 rounded-full border border-slate-200">
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <User size={18}/>
             </div>
             <span className="text-[10px] font-bold text-slate-500 uppercase">Operador 01</span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 p-6 gap-6 overflow-hidden mb-16">
        <div className="w-[28%] flex flex-col gap-4">
          <MetricCard title="PEÇAS PROCESSADAS" value={pecas} unit="un" sub="META: 1.500" meta="EFICIÊNCIA: 83%" color="text-blue-600" data={histPecas} />
          <MetricCard title="TEMPO DE CICLO (S)" value={ciclo.toFixed(1)} unit="s" sub="MIN: 3.5s" meta="MAX: 4.8s" color="text-red-500" alert={statusMaquina === "PARADA"} data={histPecas} />
          <MetricCard title="TAXA DE ACERTO (%)" value={acerto} unit="" sub="SENSOR: ATIVO" color="text-slate-900" data={histPecas} />
        </div>

        <div className="flex-1 bg-white rounded-[2.5rem] border-2 border-slate-200 p-6 flex flex-col shadow-sm">
           <div className="flex items-center gap-2 mb-4 text-blue-500 font-bold uppercase text-[11px]">
             <LayoutDashboard size={16}/> MONITORAMENTO DE CÉLULA
           </div>
           <div className="flex-1 flex flex-col gap-4">
             <div className="flex-[3] bg-[#0f172a] rounded-[2rem] relative flex items-center justify-center overflow-hidden border-[10px] border-slate-50 shadow-inner">
                <span className="absolute top-6 right-8 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse z-20">LIVE FEED</span>
                <div className="text-center">
                  <Cpu size={80} className="text-white opacity-10 mx-auto" />
                  <p className="text-slate-500 font-mono text-[10px] mt-4 uppercase tracking-[0.3em]">Visualização em Tempo Real</p>
                </div>
             </div>
             <div className="flex-[1.5] flex justify-around items-center bg-slate-50 rounded-[2rem] p-4 border-2 border-slate-100 shadow-sm">
                <Circle bg="bg-black" count={contagemCores.preto} label="PRETO" active={deteccaoAtiva === "preto"} />
                <Circle bg="bg-emerald-600" count={contagemCores.verde} label="VERDE" active={deteccaoAtiva === "verde"} />
                <Circle bg="bg-slate-400" count={contagemCores.cinza} label="CINZA" active={deteccaoAtiva === "cinza"} />
                <Circle bg="bg-red-950" count={contagemCores.erros} label="FALHA" active={deteccaoAtiva === "erro"} icon={<XCircle className="text-red-500" size={20}/>} />
             </div>
           </div>
        </div>

        <div className="w-[25%] flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="italic font-black text-[11px] mb-3 uppercase tracking-tighter text-slate-400">STATUS DE LINHA</h3>
              <StatusProgress label="OEE GLOBAL" value={83} color="bg-blue-500" />
              <StatusProgress label="SAÚDE DE ATIVOS" value={99} color="bg-slate-900" />
          </div>
          <div className="flex-1 bg-slate-50 rounded-3xl p-5 flex flex-col overflow-hidden border-2 border-white shadow-md">
            <h3 className="text-slate-400 text-[10px] font-black mb-3 uppercase tracking-widest text-center border-b border-slate-200 pb-2">Log de Eventos</h3>
            <div className="flex-1 font-mono text-[10px] space-y-2 overflow-y-auto pr-2 custom-scrollbar">
              {logs.map((l, i) => (
                <div key={i} className={`flex flex-col gap-1 py-2 px-3 rounded-lg bg-white border-l-4 ${l.border} shadow-sm transition-all duration-300`}>
                  <div className="flex justify-between items-center opacity-60">
                    <span className="text-[9px] text-slate-500 font-bold">🕒 {l.time}</span>
                  </div>
                  <span className={`${l.color} text-[11px] leading-tight tracking-tight`}>{l.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className={`fixed bottom-0 w-full p-4 flex justify-between items-center z-50 transition-colors duration-500 ${
        statusMaquina === "RUNNING" ? "bg-emerald-600" : "bg-red-600"
      }`}>
        <div className="flex items-center gap-3 text-white font-black italic px-4">
          {statusMaquina === "RUNNING" ? <CheckCircle size={28} /> : <AlertTriangle size={28} className="animate-bounce" />}
          <span className="text-2xl tracking-tighter uppercase">
            {statusMaquina === "RUNNING" ? "SISTEMA EM OPERAÇÃO" : "FALHA / PARADA TÉCNICA"}
          </span>
        </div>
        <div className="text-white/50 text-[10px] font-bold px-8 uppercase tracking-widest">
          Industry 4.0 Standard Monitoring
        </div>
      </footer>
    </div>
  );
}

const MetricCard = ({ title, value, unit, sub, meta, color, alert, data }: MetricProps) => (
  <div className={`bg-white p-5 rounded-xl border-2 transition-all duration-300 ${alert ? 'border-red-500 bg-red-50 animate-pulse' : 'border-slate-100'} shadow-sm relative overflow-hidden flex-1`}>
    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 mb-1 uppercase">{title} <Inbox size={14}/></div>
    <div className="flex items-baseline gap-1">
      <span className={`text-3xl font-black ${color}`}>{value.toLocaleString('pt-BR')}</span>
      <span className="text-slate-400 font-bold text-base ml-1">{unit}</span>
    </div>
    <div className="h-6 w-full mt-2 opacity-30">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}><Line type="monotone" dataKey="pv" stroke={alert ? '#ef4444' : '#3b82f6'} strokeWidth={2} dot={false} /></LineChart>
      </ResponsiveContainer>
    </div>
    <div className="flex justify-between mt-2 text-[9px] font-black text-slate-400 border-t pt-2 uppercase tracking-widest">
      <span>{sub}</span> <span className="text-blue-500">{meta}</span>
    </div>
  </div>
);

const Circle = ({ bg, count, label, active, icon }: CircleProps) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`${bg} w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 relative shadow-inner ${
        active 
        ? 'border-blue-400 scale-110 shadow-lg' 
        : 'border-white/10 opacity-30'}`}>
      {icon && active && <div className="absolute top-1">{icon}</div>}
      <span className="text-white text-xl font-black">{count}</span>
    </div>
    <span className={`text-[9px] font-black tracking-widest text-center transition-colors ${active ? 'text-slate-900' : 'text-slate-300'}`}>{label}</span>
  </div>
);

const StatusProgress = ({ label, value, color }: ProgressProps) => (
  <div className="mb-3">
    <div className="flex justify-between text-[8px] font-black mb-1 text-slate-500 uppercase tracking-tighter">
      <span>{label}</span> <span>{value}%</span>
    </div>
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);