## Demonstração
<img width="1362" height="691" alt="print_dashboard" src="https://github.com/user-attachments/assets/f0bd9a2c-dc75-4d61-b09b-4fb97d4092dd" />

<img width="1362" height="692" alt="print_separacaocores" src="https://github.com/user-attachments/assets/d7aae99e-23cd-4a88-984c-2b736c4da0e2" />

<img width="1364" height="690" alt="print_robo1" src="https://github.com/user-attachments/assets/505f4cac-4ab4-492e-ac38-a576b9a68b0f" />

# 🤖 Dashboard de Monitoramento Industrial - Robotic Cell (SENAI | Tech)

Este projeto é um sistema de monitoramento em tempo real (**Digital Twin**) desenvolvido como parte do currículo do curso no **SENAI | Tech**. O dashboard exibe o status operacional, telemetria de sensores e controles de segurança de uma célula robótica industrial (FANUC).

![Status do Projeto](https://img.shields.io/badge/Status-Em%20Desenvolvimento-green)
![Tecnologia](https://img.shields.io/badge/Framework-Next.js%2015-blue)
![Porta-SSE](https://img.shields.io/badge/Porta-3001-orange)

---

## 🚀 Funcionalidades

- **Monitoramento em Tempo Real:** Conexão via **SSE (Server-Sent Events)** para atualização instantânea dos dados sem necessidade de refresh.
- **Interface Industrial:** Design focado em UX industrial, desenvolvido inicialmente no **Figma** e implementado com **Tailwind CSS**.
- **Segurança Industrial:** Monitoramento de botão de Emergência (E-STOP) e estados de proteção do robô.
- **Gestão de Ativos:** Tela de cadastro de funcionários e operadores com listagem dinâmica.
- **Simulador de Estresse:** Ferramenta interna para testes de telemetria e carga de dados.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** Next.js (React + TypeScript).
- **Backend:** Node.js (Servidor SSE nativo para distribuição de eventos).
- **Automação/Lógica:** Node-RED (Integração com lógica de CLP e simulação de sinais).
- **Simulação:** Script Node.js independente para testes de sensores.

---
## 📂 Estrutura do Projeto

A organização do diretório segue as convenções do **Next.js 15 (App Router)**, separando a lógica de comunicação da interface:

- **/app**: Contém as rotas e páginas principais do sistema.
  - `/robo`: Dashboard principal de monitoramento da célula FANUC.
  - `/cadastro`: Tela de gestão de operadores e ativos.
  - `/separacao_cores`: Interface específica para a estação de triagem.
- **/hooks**: Hook personalizado `useRobotSSE.ts` para gerenciar a conexão em tempo real.
- **/data**: Armazenamento de estados iniciais e constantes do sistema.
- **/public**: Assets visuais, incluindo logos do SENAI, Fanuc e ícones de máquinas.
- **server.js**: Servidor Node.js responsável por gerenciar os eventos SSE.
- **simulador.js**: Script para geração de telemetria artificial para testes de estresse.
- **next.config.ts**: Configurações globais e otimizações do framework.

---
## 🔌 Arquitetura de Comunicação

O fluxo de dados segue a hierarquia de automação moderna:
1. **Sinal de Campo:** O **Node-RED** ou o **Simulador JS** envia um pacote JSON via HTTP POST.
2. **Middleware (Server.js):** O servidor Node.js centraliza os dados e os retransmite via SSE.
3. **HMI (Next.js):** O Dashboard recebe o stream e atualiza os indicadores (LEDs, gráficos e logs).

---

## 🧪 O Simulador (`simulador.js`)

Para facilitar os testes de desenvolvimento e validação da interface sem a necessidade de abrir o Node-RED, o projeto conta com um simulador de telemetria dedicado.

**O que ele faz:**
- Gera variações aleatórias de temperatura e carga.
- Simula ciclos de produção (contagem de peças).
- Alterna estados de erro para validar os alertas visuais no Front-End.

**Como rodar o simulador:**
Em um terminal separado, execute:
```bash
node simulador.js
🌐 Deploy vs. Ambiente Local
🏠 Ambiente Local (localhost)
Funcionalidade Total: Ao rodar npm run all, você ativa o ecossistema completo (Front, Server e Node-RED).

Interatividade: Comandos enviados pelo dashboard afetam o simulador e o fluxo de dados.

☁️ Ambiente de Produção (Vercel)
Finalidade: Demonstração de UI/UX e Portfólio Front-End.

Limitação: Como o motor de dados (Node-RED/Simulador) reside localmente, a versão em nuvem não exibe telemetria real por falta de acesso ao hardware local.

📦 Como Instalar e Rodar
Instalar Dependências:

Bash
npm install
Iniciar Ambiente Completo:

Bash
npm run all

Dashboard: http://localhost:3000

Interface Node-RED: http://localhost:1880

Servidor SSE: http://localhost:3001/events

🔗 Links
Repositório: https://github.com/gilbertojunior06/nextjs_framework

Demo Online: https://nextjs-framework-five.vercel.app

👤 Desenvolvedor
Gilberto Antônio de Almeida Silvério Júnior
Estudante de Desenvolvimento Front-End & Automação Industrial - SENAI Tech

Orientação: Profª. Natalia Lima Oliveira (Lógica Industrial e Automação)


