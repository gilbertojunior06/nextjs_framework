'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeft, UserCircle, Bell, Settings, Circle, Terminal, Activity } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRobotSSE } from '@/hooks/useRobotSSE';

// --- INTERFACES ---
interface MetricProps { title: string; value: string | number; unit: string; sub: string; meta: string; color: string; }
interface CircleProps { label: string; count: number; colorClass: string; }
interface LogEntry { msg: string; time: string; id: string; }

const MetricBox = ({ title, value, unit, sub, meta, color }: MetricProps) => (
  <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm flex-1 flex flex-col justify-center min-h-[110px]">
    <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tight">{title}</p>
    <div className="flex items-baseline gap-1">
      <h2 className={`text-3xl font-black ${color}`}>{value}</h2>
      <span className="text-slate-400 font-bold text-xs uppercase">{unit}</span>
    </div>
    <div className="flex justify-between mt-2 text-[9px] font-black text-slate-400 border-t pt-2 uppercase tracking-tighter">
      <span>{sub}</span> <span className="text-blue-500 font-black">{meta}</span>
    </div>
  </div>
);

const StatusCircle = ({ label, count, colorClass }: CircleProps) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`w-16 h-16 rounded-full border-[4px] border-white shadow-lg flex items-center justify-center transition-all duration-500 ${colorClass}`}>
      <span className="text-white font-black text-2xl leading-none">{count}</span>
    </div>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center leading-tight"> PEÇAS<br/>{label} </span>
  </div>
);

export default function DashboardRobotica() {
  const [time, setTime] = useState('--:--:--');
  const [hasNewNotification, setHasNewNotification] = useState(true); 
  
  // Pegando 'connected' e 'data' do seu hook real
  const { data: sseData, connected } = useRobotSSE();

  const [dados, setDados] = useState({
    totalPecas: 0,
    totalFalhas: 0,
    taxaAcerto: "0%",
    oee: 0,
    contagemCores: { azul: 0, verde: 0, vermelho: 0 }
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Monitora o SSE e atualiza o estado ignorando erros de tipagem com 'as any'
  useEffect(() => {
    if (sseData) {
      const sse = sseData as any; 

      setDados({
        totalPecas: sse.total_pecas || 0,
        totalFalhas: sse.total_falhas || 0,
        taxaAcerto: String(sse.taxa_acerto || "0%"),
        oee: Number(sse.oee || 0),
        contagemCores: {
          azul: sse.azul || 0,
          verde: sse.verde || 0,
          vermelho: sse.vermelho || 0
        }
      });

      if (sse.ultimo_log && sse.ultimo_log !== "Sem atividade") {
        setLogs(prev => {
          if (prev.length > 0 && prev[0].msg === sse.ultimo_log) return prev;
          const newLog = { 
            msg: sse.ultimo_log, 
            time: new Date().toLocaleTimeString('pt-BR'), 
            id: `log-${Date.now()}` 
          };
          return [newLog, ...prev].slice(0, 10);
        });
      }
    }
  }, [sseData]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('pt-BR')), 1000);
    return () => clearInterval(timer);
  }, []); 

  return (
    <div className="flex flex-col h-screen bg-[#f1f5f9] text-slate-700 overflow-hidden font-sans">
      
      {/* --- CABEÇALHO --- */}
      <header className="flex items-center justify-between px-8 h-20 bg-white border-b-2 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-200 transition-all shadow-sm">
            <ArrowLeft size={18} className="text-slate-400 group-hover:text-blue-600" />
            <span className="text-[10px] font-black text-slate-500 uppercase">Voltar</span>
          </Link>
          <Image src="/senai.png" alt="Logo SENAI" width={120} height={40} className="w-auto h-auto object-contain" priority />
          <Image src="/robo.png" alt="Robo" width={50} height={40} className="w-auto h-auto object-contain mix-blend-multiply brightness-110" priority />
          <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">Célula Robótica - Separação de Cores</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="bg-slate-100 px-6 py-2 rounded-xl border-2 border-white shadow-sm flex items-center gap-3">
            <Clock className="w-5 h-5 text-slate-400" />
            <span className="text-xl font-black font-mono text-slate-700">{time}</span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setHasNewNotification(false)} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-500 transition-all relative group">
              <Bell size={20} className="group-hover:rotate-12 transition-transform" />
              {hasNewNotification && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-bounce" />}
            </button>
            <button className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-500 transition-all group">
              <Settings size={20} className="group-hover:rotate-45 transition-transform" />
            </button>
            <div className="flex items-center gap-3 ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-700 uppercase leading-none">Gilberto Jr.</p>
                <p className="text-[8px] font-bold text-blue-500 uppercase">Administrador</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                <UserCircle size={28} className="text-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- CONTEÚDO --- */}
      <main className="flex flex-1 p-6 gap-6 overflow-hidden">
        <div className="w-[28%] flex flex-col gap-4">
          <MetricBox title="TOTAL PRODUZIDO" value={dados.totalPecas} unit="UN" sub="CONTAGEM" meta="META: 1.500" color="text-blue-600" />
          <MetricBox title="TAXA DE QUALIDADE" value={dados.taxaAcerto} unit="" sub="SENSOR ÓPTICO" meta="ACERTO" color="text-slate-900" />
          <MetricBox title="PEÇAS REJEITADAS" value={dados.totalFalhas} unit="ERR" sub="DESCARTE" meta="FALHAS" color="text-red-500" />
        </div>

        <div className="flex-1 bg-white rounded-[2.5rem] border-2 p-6 flex flex-col shadow-sm">
            <div className="flex-[3] w-full bg-[#0f172a] rounded-[2rem] relative flex items-center justify-center border-[8px] border-slate-50 overflow-hidden shadow-inner">
               <span className="absolute top-6 right-8 bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-md animate-pulse z-20 uppercase tracking-widest flex items-center gap-2">
                 <Circle size={8} fill="white" /> LIVE DATA
               </span>
               <div className="text-slate-500 text-xs uppercase font-black opacity-20 italic">Monitoramento de Fluxo Industrial</div>
            </div>
            <div className="flex-1 flex justify-around items-center bg-slate-50 rounded-[2rem] mt-4 px-12 py-4 border-2 border-slate-100">
                 <StatusCircle label="AZUL" count={dados.contagemCores.azul} colorClass="bg-blue-600" />
                 <StatusCircle label="VERDE" count={dados.contagemCores.verde} colorClass="bg-emerald-600" />
                 <StatusCircle label="VERMELHO" count={dados.contagemCores.vermelho} colorClass="bg-red-600" />
            </div>
        </div>

        <div className="w-[25%] flex flex-col gap-4 relative">
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm shrink-0">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4 border-b pb-2">PRODUTIVIDADE (OEE)</h3>
              <div className="flex justify-between mb-2 text-[11px] font-bold uppercase">
                <span>Eficiência Global</span>
                <span className={dados.oee < 50 ? "text-red-500" : "text-blue-500"}>{dados.oee}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden border p-[2px]">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${dados.oee}%` }}></div>
              </div>
          </div>
          <div className="flex-1 bg-slate-50 rounded-[2rem] p-5 flex flex-col border-2 border-white shadow-lg overflow-hidden">
            <h3 className="text-[10px] font-black text-slate-400 uppercase text-center border-b pb-2 mb-3">HISTÓRICO RECENTE</h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
               {logs.length === 0 ? <div className="text-[9px] text-slate-400 text-center mt-10 italic">Aguardando sinais...</div> : 
                 logs.map(log => (
                   <div key={log.id} className="text-[9px] font-bold border-b border-slate-200 py-2 uppercase flex justify-between items-center">
                     <span className="text-slate-600 truncate mr-2">{log.msg}</span>
                     <span className="text-slate-400 shrink-0 font-mono bg-white px-1 rounded shadow-sm">{log.time}</span>
                   </div>
                 ))
               }
            </div>
          </div>
        </div>
      </main>

      {/* --- RODAPÉ --- */}
      <footer className="h-14 bg-white flex items-center justify-center gap-8 border-t-2 shrink-0 shadow-sm">
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
          <Terminal size={14} className="text-blue-500" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            SISTEMA: <span className="text-emerald-600">APP ROUTER ACTIVE</span>
          </span>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        </div>

        <div className="w-1 h-1 bg-slate-300 rounded-full" />

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
          <Activity size={14} className={connected ? "text-emerald-500" : "text-red-500"} />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            STREAM: <span className={connected ? "text-emerald-600" : "text-red-500"}>
              {connected ? "SSE CONNECTED" : "SSE DISCONNECTED"}
            </span>
          </span>
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
        </div>
      </footer>
    </div>
  );
}