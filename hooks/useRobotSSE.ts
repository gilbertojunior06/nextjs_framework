import { useEffect, useState } from 'react'

// 1. Criamos uma Interface para definir o formato dos dados do robô
interface RobotData {
  // Estados de Energia e Segurança
  power?: boolean;
  emergency?: boolean;
  
  // Estados dos Botões de Controle
  isHome?: boolean;
  isSleep?: boolean;
  
  // Programas e Execução
  activePgm?: number | null; // 0, 1, 2 ou null
  pgm1?: boolean;            // Status individual da Rampa 1
  pgm2?: boolean;            // Status individual da Rampa 2
  pgm3?: boolean;            // Status individual da Rampa 3
  
  // Dados de Processo (O que aparece nos quadradinhos de baixo)
  status?: number;           // 0 a 5 (conforme seu mapa)
  mode?: string;             // 'REMOTO', 'MANUAL', etc.
  load?: string;             // Peso da carga (ex: '1.5kg')
  temp?: string;             // Temperatura (ex: '38°C')
  oee?: string;              // Eficiência (ex: '92%')
  
  // Contadores (Se você quiser mostrar no log quantas peças o robô fez)
  peçasProduzidas?: number;
  falhas?: number;
}



const API_URL = 'http://localhost:3001/events'

export function useRobotSSE() {
  // 2. Trocamos o <any> pelo tipo da nossa Interface <RobotData | null>
  const [data, setData] = useState<RobotData | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const source = new EventSource(API_URL)

    source.onopen = () => {
      setConnected(true)
      console.log('[SSE] Conectado');
    }

    source.onmessage = (e) => {
      try {
        const parsedData: RobotData = JSON.parse(e.data);
        console.log("DADO RECEBIDO DO NODE-RED:", parsedData);
        setData(parsedData);
      } catch (err) {
        console.error('[SSE] Erro ao processar dados:', err);
      }
    }

    source.onerror = () => {
      setConnected(false)
      console.warn('[SSE] Conexão perdida');
    }

    return () => source.close()
  }, [])

  return { data, connected }
}