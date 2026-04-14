import http from 'http';

let clients = [];

const server = http.createServer((req, res) => {
    // Configuração manual de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Responde requisições de pre-flight do navegador
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // --- CANAL DE DADOS (Next.js se conecta aqui) ---
    // Alterado para /events para funcionar com o useRobotSSE da professora
    if (req.method === 'GET' && req.url === '/events') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        console.log('✅ Dashboard Conectado em /events!');
        clients.push(res);

        // Remove o cliente da lista quando ele fecha a aba/página
        req.on('close', () => {
            clients = clients.filter(client => client !== res);
            console.log('❌ Dashboard Desconectado.');
        });
        return;
    } 

    // --- ENTRADA DE DADOS (Simulador/Node-RED enviam para cá) ---
    // O Node-RED deve enviar um POST para http://localhost:3001/
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                // Valida se o que chegou é um JSON antes de repassar
                JSON.parse(body); 
                console.log('🤖 Dados recebidos do Robô:', body);
                
                // Repassa os dados para todos os Dashboards conectados via SSE
                clients.forEach(client => {
                    client.write(`data: ${body}\n\n`);
                });
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'sucesso', msg: 'Dados enviados ao dashboard' }));
            } catch (err) {
                console.error('❌ Erro no JSON recebido');
                res.writeHead(400);
                res.end('JSON Inválido');
            }
        });
    } else {
        // Se tentar acessar qualquer outra rota (tipo /update-robot ou /teste)
        res.writeHead(404);
        res.end('Rota nao encontrada. Use /events para GET ou / para POST.');
    }
});

// Inicia o servidor na porta 3001
server.listen(3001, () => {
    console.log('\n=========================================');
    console.log('🚀 SERVIDOR SSE ATIVO NA PORTA 3001');
    console.log('=========================================');
    console.log('FRONTEND (Next.js): http://localhost:3001/events');
    console.log('BACKEND (Node-RED): POST para http://localhost:3001/');
    console.log('=========================================\n');
});