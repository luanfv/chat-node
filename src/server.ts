import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';

class App {
    private readonly app: Application;
    private readonly http: http.Server;
    private readonly io: Server;

    constructor() {
        this.app = express();
        this.http = http.createServer(this.app);
        this.io = new Server(this.http);
    }

    listenServer(port = 3000) {
        this.http.listen(port, () => console.log(`Server is running at port ${port}`));
        this.listenSocket();
        this.setupRoutes();
    }

    private listenSocket() {
        this.io.on('connection', (socket) => {
            console.log('>> CONNECTION ID:', socket.id);
            
            socket.on('message', (msg) => {
                this.io.emit('message', msg);
            });
        });
    }

    private setupRoutes() {
        this.app.get('/', (req, res) => {
            res.sendFile(`${__dirname}/index.html`);
        });
    }
}

const app = new App();
app.listenServer(3000);