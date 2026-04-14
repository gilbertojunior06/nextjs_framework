// app/robo/logEvents.ts

export const logRobo = (mensagem: string, dados?: any) => {
  const timestamp = new Date().toLocaleTimeString();
  
  // O %c permite que você use estilos CSS no console do F12
  console.log(
    `%c[ROBÔ LOG ${timestamp}] %c${mensagem}`,
    "color: #71717a; font-size: 10px;", // Estilo do timestamp
    "color: #22c55e; font-weight: bold; font-size: 12px;", // Estilo da mensagem (Verde)
    dados || ""
  );
};