const http = require('http');
const { server: wisp } = require('@mercuryworkshop/wisp-js/server');

const server = http.createServer((req, res) => {
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const isSecure = req.headers['x-forwarded-proto'] === 'https' || req.socket.encrypted;
    const protocol = isSecure ? 'wss' : 'ws';
    const url = `${protocol}://${host}/`;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: sans-serif; background: #1a1a1a; color: white; }
                .container { display: flex; align-items: center; gap: 10px; padding: 15px 25px; background: #333; border-radius: 8px; }
                button { padding: 8px 15px; cursor: pointer; border: none; border-radius: 4px; background: #007bff; color: white; font-weight: bold; }
                button:hover { background: #0056b3; }
                button:active { transform: scale(0.95); }
            </style>
        </head>
        <body>
            <div class="container">
                <span>ip: <span id="url">${url}</span></span>
                <button onclick="copy()">Copy</button>
            </div>
            <script>
                function copy() {
                    const text = document.getElementById('url').innerText;
                    navigator.clipboard.writeText(text);
                    const btn = document.querySelector('button');
                    btn.innerText = 'Done!';
                    setTimeout(() => btn.innerText = 'Copy', 1000);
                }
            </script>
        </body>
        </html>
    `);
});

server.on('upgrade', (req, socket, head) => {
    wisp.routeRequest(req, socket, head);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`wisp proxy is running`);
});
