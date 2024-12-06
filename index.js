const WebSocket = require('ws');
const http = require('http');

// Criar servidor HTTP
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Servidor WebSocket está rodando\n');
});

// Criar servidor WebSocket
const wss = new WebSocket.Server({ server });

// Gerenciar conexões WebSocket
wss.on('connection', (ws) => {
    console.log('Novo cliente conectado');

    // Enviar mensagem de boas-vindas
    ws.send('Bem-vindo ao servidor WebSocket!');

    // Lidar com mensagens recebidas
    ws.on('message', (message) => {
        console.log('Mensagem recebida:', message.toString());
        
        // Enviar mensagem de volta para o cliente
        ws.send(`Servidor recebeu sua mensagem: ${message}`);
        
        // Broadcast: enviar para todos os clientes conectados
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(`Broadcast: ${message}`);
            }
        });
    });

    // Lidar com fechamento da conexão
    ws.on('close', () => {
        console.log('Cliente desconectado');
    });

    // Lidar com erros
    ws.on('error', (error) => {
        console.error('Erro WebSocket:', error);
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});