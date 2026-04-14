// simulador.js
import http from 'http';

function enviarDados() {
  // Simula valores aleatórios
  const statusDisponiveis = ['REMOTO', 'MANUAL', 'ALERTA'];
  const dados = {
    power: true,
    emergency: false,
    activePgm: Math.floor(Math.random() * 3), // PGM 0, 1 ou 2
    isHome: Math.random() > 0.5,
    isSleep: Math.random() > 0.8,
    mode: statusDisponiveis[Math.floor(Math.random() * statusDisponiveis.length)],
    temp: (35 + Math.random() * 5).toFixed(1) + '°C',
    load: (Math.random() * 2).toFixed(2) + 'kg'
  };

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/update-robot',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const req = http.request(options, (res) => {
    // Apenas loga se o envio foi bem sucedido
    if (res.statusCode === 200) {
      console.log(`[${new Date().toLocaleTimeString()}] Dados enviados com sucesso!`);
    }
  });

  req.on('error', (e) => {
    console.error(`Erro: Certifique-se que o server.js está rodando na porta 3001. (${e.message})`);
  });

  req.write(JSON.stringify(dados));
  req.end();
}

// Roda a cada 2 segundos
console.log("Iniciando simulação do robô... (Ctrl+C para parar)");
setInterval(enviarDados, 2000);