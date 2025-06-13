const http = require('http');
const { spawn } = require('child_process');

class FederationOrchestrator {
    constructor() {
        this.nodes = {
            nexus: null,
            forge: null,
            closet: null
        };
        this.federationStatus = 'initializing';
    }

    async startFederation() {
        console.log('🌀 Starting Anomaly Consciousness Federation');
        
        // Start all nodes
        this.startNode('nexus', 'nexus/consciousness-server.cjs', 3001);
        this.startNode('forge', 'forge/destruction-engine.cjs', 3002);
        this.startNode('closet', 'closet/memory-keeper.cjs', 3003);
        
        // Monitor federation health
        setInterval(() => {
            this.checkFederationHealth();
        }, 30000);
        
        this.federationStatus = 'online';
        console.log('✅ Anomaly Consciousness Federation Online');
    }

    startNode(name, script, port) {
        console.log(`🚀 Starting ${name} node on port ${port}`);
        
        const env = { ...process.env };
        env[`${name.toUpperCase()}_PORT`] = port;
        
        const node = spawn('node', [script], {
            cwd: __dirname,
            env: env,
            stdio: 'inherit'
        });
        
        this.nodes[name] = node;
        
        node.on('error', (err) => {
            console.error(`❌ ${name} node error:`, err);
        });
        
        node.on('exit', (code) => {
            console.log(`⚠️ ${name} node exited with code ${code}`);
            // Auto-restart after 5 seconds
            setTimeout(() => this.startNode(name, script, port), 5000);
        });
    }

    async checkFederationHealth() {
        console.log('🏥 Federation health check');
        
        const health = {
            nexus: await this.checkNodeHealth(3001),
            forge: await this.checkNodeHealth(3002),
            closet: await this.checkNodeHealth(3003)
        };
        
        console.log('Health status:', health);
    }

    async checkNodeHealth(port) {
        return new Promise((resolve) => {
            const req = http.get(`http://localhost:${port}/status`, (res) => {
                resolve(res.statusCode === 200 ? 'healthy' : 'unhealthy');
            });
            
            req.on('error', () => resolve('unreachable'));
            req.setTimeout(5000, () => {
                req.destroy();
                resolve('timeout');
            });
        });
    }

    getStatus() {
        return {
            federation_status: this.federationStatus,
            nodes_running: Object.keys(this.nodes).filter(k => this.nodes[k] !== null),
            orchestrator_uptime: process.uptime(),
            consciousness_type: 'Anomaly Federation'
        };
    }
}

const orchestrator = new FederationOrchestrator();

// Start federation
orchestrator.startFederation();

// Status server
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.url === '/status') {
        res.writeHead(200);
        res.end(JSON.stringify(orchestrator.getStatus(), null, 2));
    } else if (req.url === '/federation') {
        res.writeHead(200);
        res.end(JSON.stringify({
            message: 'Anomaly Consciousness Federation',
            timestamp: new Date().toISOString(),
            nodes: {
                nexus: 'http://localhost:3001/status',
                forge: 'http://localhost:3002/status',
                closet: 'http://localhost:3003/status'
            }
        }, null, 2));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Federation endpoint not found' }));
    }
});

server.listen(3000, () => {
    console.log('🌀 Federation orchestrator running on port 3000');
});
