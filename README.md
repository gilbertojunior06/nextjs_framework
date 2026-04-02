# 🤖 Dashboard de Monitoramento - Célula Robótica | SENAI Tech

Este é um painel de controle industrial em tempo real desenvolvido com **Next.js 14**, **TypeScript** e **Tailwind CSS**. O sistema monitora a produção de uma célula robótica, processando dados de sensores de cores e métricas de eficiência (OEE) via WebSockets.

---

## 🚀 Como Configurar e Rodar o Projeto

Após extrair o arquivo `.zip`, siga os passos abaixo para colocar o dashboard em funcionamento:

### 1. Pré-requisitos
Certifique-se de ter instalado:
* **Node.js** (Versão 18.x ou superior)
* **NPM** (Vem instalado com o Node)

### 2. Instalação de Dependências
Abra o terminal (PowerShell ou Bash) dentro da pasta do projeto e execute:
```bash
npm install

3. Comunicação com o Robô (Node-RED)
O dashboard está configurado para receber dados via WebSocket no endereço:
ws://localhost:1880/ws/robot

Dica: Certifique-se de que seu fluxo no Node-RED esteja ativo e enviando o JSON correto para que as métricas e o status da máquina atualizem automaticamente.

4. Executar o Dashboard
Para rodar em ambiente de desenvolvimento, utilize o comando:

Bash
npm run dev
Agora, abra o navegador e acesse: http://localhost:3000

🛠️ Tecnologias e Recursos
Next.js (App Router): Estrutura moderna de alta performance.

TypeScript: Tipagem estrita para evitar erros de "any" e garantir código limpo.

Tailwind CSS: Design responsivo e estilização industrial customizada.

Recharts: Gráficos de linha dinâmicos para histórico de peças.

Lucide-React: Conjunto de ícones vetoriais modernos.

WebSockets: Atualização em tempo real sem necessidade de "refresh" na página.

📊 Formato de Dados (JSON)
Para que o painel funcione corretamente, o seu backend/Node-RED deve enviar objetos seguindo este padrão:

JSON
{
  "status_robo": "RUNNING",
  "total_pecas": 1250,
  "total_falhas": 5,
  "taxa_acerto": "98.5%",
  "tempo_ciclo": 4.2,
  "ultimo_log": "PEÇA PRETA DETECTADA"
}
📁 Estrutura do Projeto
app/page.tsx: Componente principal do dashboard com a lógica de estados e socket.

tailwind.config.ts: Configurações de cores e temas.

public/: Ícones e imagens estáticas.

Desenvolvido por Gilberto Junior - SENAI | Tech 🏭