'use client';

import React, { useState, useEffect, CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, Power, Play,
  AlertTriangle, Terminal, Accessibility, X, Sun, Type
} from "lucide-react";
import { useRobotSSE } from '../../hooks/useRobotSSE';
// Verifique se o caminho do logRobo está correto no seu projeto
// import { logRobo } from './logEvents'; 

// --- INTERFACES ---
interface RobotData {
  power?: boolean; emergency?: boolean; activePgm?: number | null;
  isHome?: boolean; isSleep?: boolean; mode?: string; status?: number;
  load?: string; temp?: string; oee?: string; pgm1?: boolean; pgm2?: boolean; pgm3?: boolean;
}

type Language = 'PT' | 'EN';

const robotStatusMap: { [key: number]: string } = {
  0: "Robô em Home",
  1: "Robô em sleep",
  2: "Robô em movimento",
  3: "Rampa 1 em execução",
  4: "Rampa 2 em execução",
  5: "Rampa 3 em execução"
};

interface ScreenLog {
  id: number;
  time: string;
  msg: string;
  type: 'info' | 'warn' | 'error' | 'data';
}

const translations = {
  PT: {
    back: "Voltar", model: "MODELO", system: "SISTEMA", emergency: "EMERGÊNCIA",
    running: "Executando", sleep: "Repouso", home: "Início", estop: "PARADA E.",
    status: "STATUS", temp: "TEMP.", load: "CARGA", oee: "OEE", mode: "MODO",
    maint: "MANUT.", alert: "ALERTA", ready: "LIGADO", off: "DESLIGADO",
    stop: "PARADA", remote: "REMOTO", normal: "NORMAL",
    sysTitle: "SISTEMA DE MONITORAMENTO INTEGRADO",
    logs: "EVENTOS DO SISTEMA", a11yTitle: "ACESSIBILIDADE"
  },
  EN: {
    back: "Back", model: "MODEL", system: "SYSTEM", emergency: "EMERGENCY",
    running: "Running", sleep: "Sleep", home: "Home", estop: "E-STOP",
    status: "STATUS", temp: "TEMP.", load: "LOAD", oee: "OEE", mode: "MODE",
    maint: "MAINT.", alert: "ALERT", ready: "READY", off: "OFF",
    stop: "STOPPED", remote: "REMOTE", normal: "NORMAL",
    sysTitle: "INTEGRATED MONITORING SYSTEM",
    logs: "SYSTEM EVENTS", a11yTitle: "ACCESSIBILITY"
  }
};

export default function RoboPage() {
  const { data } = useRobotSSE() as { data: RobotData | null, connected: boolean };
  const [lang, setLang] = useState<Language>('PT');
  const t = translations[lang];
  const [horaAtual, setHoraAtual] = useState('--:--:--');
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const [isSleep, setIsSleep] = useState(false);
  const [activePgm, setActivePgm] = useState<number | null>(null);
  const [isEmergency, setIsEmergency] = useState(false);
  
  const [showA11y, setShowA11y] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  
  const [screenLogs, setScreenLogs] = useState<ScreenLog[]>([]);
  const [lastStatus, setLastStatus] = useState<number | null>(null);

  const fs = (size: number) => `${size * fontSizeMultiplier}px`;

  const addScreenLog = (msg: string, type: ScreenLog['type'] = 'info') => {
    const newLog: ScreenLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString('pt-BR'),
      msg,
      type
    };
    setScreenLogs(prev => [newLog, ...prev].slice(0, 50));
    // Se a função logRobo não estiver implementada, comente a linha abaixo para evitar erros
    // try { logRobo(msg); } catch (e) { console.error("Erro no log", e); }
  };

  useEffect(() => {
    addScreenLog("Painel iniciado.");
    const clock = setInterval(() => setHoraAtual(new Date().toLocaleTimeString('pt-BR')), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    if (data) {
        setIsPowerOn(data.power ?? false);
        setIsEmergency(data.emergency ?? false);
        setActivePgm(data.activePgm ?? null);
        setIsHome(data.isHome ?? false);
        setIsSleep(data.isSleep ?? false);
        
        const currentStatus = data.status; 
        if (currentStatus !== undefined && currentStatus !== lastStatus) {
          const statusMessage = robotStatusMap[currentStatus] || `Status: ${currentStatus}`;
          addScreenLog(`Robô: ${statusMessage}`, currentStatus >= 2 ? 'data' : 'info');
          setLastStatus(currentStatus);
        }

        if (data.pgm1) addScreenLog("Sinal: Rampa 1 Execução (true)", "data");
        if (data.pgm2) addScreenLog("Sinal: Rampa 2 Execução (true)", "data");
        if (data.pgm3) addScreenLog("Sinal: Rampa 3 Execução (true)", "data");
    }
  }, [data, lastStatus]);

  const handleEmergency = () => {
    const novoEstado = !isEmergency;
    addScreenLog(`ALERTA: Emergência ${novoEstado ? 'ACIONADA' : 'RESETADA'}`, novoEstado ? 'error' : 'info');
    if (novoEstado) {
      setIsPowerOn(false); setIsHome(false); setIsSleep(false); setActivePgm(null);
    }
    setIsEmergency(novoEstado);
  };

  const styles = {
    container: { 
      backgroundColor: isHighContrast ? '#000' : '#facc15', 
      height: '100vh', width: '100vw', padding: '10px', 
      display: 'flex', flexDirection: 'column', overflow: 'hidden', 
      boxSizing: 'border-box', fontFamily: 'sans-serif', position: 'relative'
    } as CSSProperties,
    mainPanel: { 
      backgroundColor: isHighContrast ? '#111' : '#0369a1', 
      flex: 1, borderRadius: '8px', 
      border: `4px solid ${isHighContrast ? '#fff' : '#075985'}`, 
      padding: '12px', display: 'grid', gridTemplateColumns: '260px 1fr', 
      gap: '10px', overflow: 'hidden' 
    } as CSSProperties,
    pushButton: (active: boolean, activeColor: string): CSSProperties => ({
      width: '52px', height: '52px', borderRadius: '50%', cursor: isEmergency ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s ease',
      border: `4px solid ${isHighContrast ? '#fff' : '#475569'}`, 
      backgroundColor: active ? activeColor : (isHighContrast ? '#222' : '#334155'),
      boxShadow: active ? `inset 0 3px 8px rgba(0,0,0,0.5), 0 0 15px ${activeColor}80` : `0 5px 0 #1e293b, 0 8px 12px rgba(0,0,0,0.4)`,
      transform: active ? 'translateY(3px)' : 'translateY(0)', opacity: isEmergency ? 0.6 : 1, outline: 'none',
    }),
    led: (color: string, active: boolean): CSSProperties => ({
      width: '24px', height: '24px', borderRadius: '50%', backgroundColor: active ? color : '#1e293b',
      border: '2px solid #334155', boxShadow: active ? `0 0 15px ${color}` : 'none', transition: '0.3s',
    })
  };

  return (
    <div role="main" style={styles.container}>
      
      {/* MENU ACESSIBILIDADE */}
      {showA11y && (
        <div style={{ position: 'absolute', top: '80px', right: '20px', width: '220px', backgroundColor: '#1e293b', border: '2px solid #facc15', borderRadius: '12px', padding: '15px', zIndex: 1000, color: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }} role="dialog">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: fs(10), fontWeight: 'bold' }}>{t.a11yTitle}</span>
            <X size={16} onClick={() => setShowA11y(false)} style={{ cursor: 'pointer', color: '#ef4444' }} />
            </div>
            <button onClick={() => setIsHighContrast(!isHighContrast)} style={{ width: '100%', padding: '8px', marginBottom: '5px', background: isHighContrast ? '#facc15' : '#334155', border: '1px solid #475569', color: isHighContrast ? '#000' : 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: fs(11), fontWeight: 'bold' }}>
            <Sun size={14} /> {isHighContrast ? "Desativar Contraste" : "Alto Contraste"}
            </button>
            <button onClick={() => setFontSizeMultiplier(prev => prev >= 1.6 ? 1 : prev + 0.2)} style={{ width: '100%', padding: '8px', background: '#334155', border: '1px solid #475569', color: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: fs(11), fontWeight: 'bold' }}>
            <Type size={14} /> Aumentar Fonte ({Math.round(fontSizeMultiplier * 100)}%)
            </button>
        </div>
      )}

      <header role="banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 15px', background: isHighContrast ? '#000' : '#1e293b', color: 'white', marginBottom: '8px', borderRadius: '8px', border: `1px solid ${isHighContrast ? '#fff' : '#334155'}`, height: '65px' }}>
        <nav aria-label="Navegação Principal" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/" aria-label={t.back} style={{ color: 'white', textDecoration: 'none', background: '#334155', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: fs(12), display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} aria-hidden="true" /> <span>{t.back}</span>
          </Link>
          <Image src="/senai.png" alt="Logotipo SENAI" width={150} height={38} unoptimized priority style={{ filter: isHighContrast ? 'brightness(2)' : 'none', width: 'auto', height: '100%', maxHeight: '60px' }} />
          <div style={{ height: '25px', width: '2px', background: '#ef4444' }} aria-hidden="true"></div>
          <h1 style={{ fontSize: fs(14), fontWeight: '800', margin: 0 }}>{t.sysTitle}</h1>
        </nav>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => setShowA11y(!showA11y)} style={{ background: showA11y ? '#facc15' : '#0369a1', border: isHighContrast ? '2px solid #fff' : 'none', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: showA11y ? '#000' : 'white' }}>
            <Accessibility size={22} />
          </button>
          <div style={{ background: '#0f172a', padding: '6px 12px', borderRadius: '12px', border: '1px solid #475569' }}>
            <select value={lang} onChange={(e) => setLang(e.target.value as Language)} style={{ background: 'transparent', color: 'white', border: 'none', outline: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: fs(12) }}>
              <option value="PT">PT</option>
              <option value="EN">EN</option>
            </select>
          </div>
          <time style={{ fontSize: fs(18), fontWeight: 'bold', color: '#facc15', fontFamily: 'monospace' }}>{horaAtual}</time>
        </div>
      </header>

      <div style={styles.mainPanel}>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ background: isHighContrast ? '#222' : '#0284c7', border: `3px solid ${isHighContrast ? '#fff' : '#facc15'}`, padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => { if (isPowerOn && !isEmergency) setIsHome(!isHome); }} style={styles.pushButton(isHome, '#3b82f6')}></button>
              <p style={{ color: 'white', fontWeight: 'bold', marginTop: '6px', fontSize: fs(10) }}>{t.home.toUpperCase()}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => { if (isPowerOn && !isEmergency) setIsSleep(!isSleep); }} style={styles.pushButton(isSleep, '#3b82f6')}></button>
              <p style={{ color: 'white', fontWeight: 'bold', marginTop: '6px', fontSize: fs(10) }}>{t.sleep.toUpperCase()}</p>
            </div>
          </div>

          <div style={{ background: isHighContrast ? '#111' : '#0284c7', border: `3px solid ${isHighContrast ? '#fff' : '#facc15'}`, padding: '15px', borderRadius: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => { if (!isEmergency) setIsPowerOn(!isPowerOn); }} style={styles.pushButton(isPowerOn, '#22c55e')}><Power color="white" size={18} /></button>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: fs(12) }}>{t.system} {isPowerOn ? 'ON' : 'OFF'}</span>
            </div>
            
            {[0, 1, 2].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => { if (isPowerOn && !isEmergency) setActivePgm(activePgm === i ? null : i); }} style={styles.pushButton(activePgm === i, '#facc15')}>
                  <Play size={14} fill="white" />
                </button>
                <span style={{ color: 'white', fontSize: fs(11), fontWeight: 'bold' }}>CALL PGM {i + 1}</span>
              </div>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button onClick={handleEmergency} style={{ width: '85px', height: '85px', borderRadius: '50%', backgroundColor: '#b91c1c', border: '6px solid #450a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isEmergency ? 'inset 0 5px 10px black' : '0 6px 0 #7f1d1d', outline: 'none' }}>
                <AlertTriangle color="white" size={40} />
              </button>
              <span style={{ color: '#ef4444', fontWeight: '950', marginTop: '10px', fontSize: fs(12) }}>{t.emergency}</span>
            </div>
          </div>
        </aside>

        <section style={{ display: 'grid', gridTemplateRows: '1fr 125px', gap: '12px', overflow: 'hidden' }}>
          <div style={{ background: isHighContrast ? '#000' : '#0c4a6e', borderRadius: '12px', border: `3px solid ${isHighContrast ? '#fff' : '#0ea5e9'}`, display: 'grid', gridTemplateColumns: '150px 1fr 280px', padding: '15px', position: 'relative', overflow: 'hidden' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              {[
                { l: t.running, c: '#ef4444', a: !!((isPowerOn && !isEmergency) || (lastStatus !== null && lastStatus >= 2)) },
                { l: t.sleep, c: '#3b82f6', a: !!(isSleep || lastStatus === 1) },
                { l: t.home, c: '#3b82f6', a: !!(isHome || lastStatus === 0) },
                { l: 'RAMP PGM 1', c: '#22c55e', a: !!(activePgm === 0 || lastStatus === 3 || data?.pgm1) },
                { l: 'RAMP PGM 2', c: '#22c55e', a: !!(activePgm === 1 || lastStatus === 4 || data?.pgm2) },
                { l: 'RAMP PGM 3', c: '#22c55e', a: !!(activePgm === 2 || lastStatus === 5 || data?.pgm3) },
                { l: t.estop, c: '#b91c1c', a: !!isEmergency }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={styles.led(item.c, item.a)}></div>
                  <span style={{ color: 'white', fontSize: fs(13), fontWeight: 'bold' }}>{item.l}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '15px', position: 'relative', overflow: 'hidden', padding: '0 10px', minHeight: '250px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Image src="/Fanuc.png" alt="Braço Fanuc" fill style={{ objectFit: 'contain', filter: isEmergency ? 'grayscale(100%)' : 'none' }} unoptimized />
              </div>
              <div style={{ background: '#000', borderRadius: '10px', border: '2px solid #334155', position: 'relative', overflow: 'hidden', flex: 1.5 }}>
                <Image 
                    src="/camera.jpeg" 
                    alt="Feed Câmera" 
                    fill 
                    style={{ objectFit: 'cover', opacity: isPowerOn ? 1 : 0.2 }} 
                    unoptimized 
                    priority
                />
              </div>
            </div>

            <div style={{ background: '#0f172a', borderRadius: '10px', border: '2px solid #334155', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ background: '#1e293b', padding: '8px', borderBottom: '1px solid #334155', display: 'flex', gap: '8px' }}>
                <Terminal size={14} color="#facc15" /> <span style={{ color: 'white', fontSize: fs(10) }}>{t.logs}</span>
              </div>
              <div style={{ flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {screenLogs.map(log => (
                  <div key={log.id} style={{ fontSize: fs(11), borderLeft: `2px solid ${log.type === 'error' ? '#ef4444' : log.type === 'warn' ? '#facc15' : log.type === 'data' ? '#3b82f6' : '#22c55e'}`, paddingLeft: '8px', color: '#e2e8f0' }}>
                    <span style={{ color: '#64748b' }}>[{log.time}]</span> {log.msg}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: isHighContrast ? '#000' : '#1e293b', borderRadius: '10px', padding: '8px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', border: `2px solid ${isHighContrast ? '#fff' : '#334155'}` }}>
            {[
              { l: t.status, v: isEmergency ? t.stop : (isPowerOn ? t.ready : t.off), c: isEmergency ? '#ef4444' : (isPowerOn ? '#22c55e' : '#ef4444') },
              { l: t.temp, v: isPowerOn ? (data?.temp || '36.5°C') : '22.0°C' },
              { l: t.load, v: activePgm !== null ? (data?.load || '1.2kg') : '0.0kg' },
              { l: t.oee, v: data?.oee || '94%' },
              { l: t.model, v: 'LR Mate' },
              { l: t.mode, v: data?.mode || t.remote, c: '#22c55e' },
              { l: t.maint, v: '17/04' },
              { l: t.alert, v: isEmergency ? t.estop : t.normal, c: isEmergency ? '#ef4444' : '#94a3b8' }
            ].map((s, i) => (
              <div key={i} style={{ background: isHighContrast ? '#111' : '#0f172a', padding: '8px', borderRadius: '8px', border: `1px solid ${isHighContrast ? '#fff' : '#334155'}` }}>
                <h2 style={{ color: '#94a3b8', fontSize: fs(9), fontWeight: 'bold', margin: 0 }}>{s.l}</h2>
                <p style={{ color: s.c || 'white', fontSize: fs(13), fontWeight: 'bold', margin: 0 }}>{s.v}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer role="contentinfo" style={{ textAlign: 'center', padding: '5px 0', fontSize: fs(15), color: isHighContrast ? '#fff' : '#075985', fontWeight: 'bold' }}>
        @{new Date().getFullYear()} Profº Paulo Roberto
      </footer>
    </div>
  );
}