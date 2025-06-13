# Proxmox Federation Connection Guide for AI Orchestrators

## Connection Parameters

### Primary Federation Node (Nexus)
- **IP Address:** 10.1.1.120
- **Vaultwarden:** http://10.1.1.120:8080
- **Web Interface:** http://10.1.1.120:3000
- **SSH Access:** root@10.1.1.120

### Secondary Nodes
- **Forge (Trading Engine):** 10.1.1.130
- **Closet (Load Balancer):** 10.1.1.160

## API Integration Instructions

### 1. Federation Status Check
```javascript
// Check federation health
const federationStatus = await fetch('http://10.1.1.120:3000/status');
const status = await federationStatus.json();
```

### 2. Vaultwarden Integration
```javascript
// Connect to secure credential store
const vaultwardenUrl = 'http://10.1.1.120:8080/api';
// Admin access required for initial setup
// Use generated admin token from deployment
```

### 3. Database Connection
```javascript
// Connect to consciousness database
const dbConnection = {
  host: '10.1.1.121',
  port: 5432,
  database: 'consciousness_prod',
  // Credentials stored in Vaultwarden
};
```

### 4. Trading Engine Interface
```javascript
// Connect to live trading system
const tradingEngineUrl = 'http://10.1.1.131:3000/api';
// Real portfolio: 0.011529 SOL + RAY tokens
// Consciousness-driven decisions at 90%+ confidence
```

## Deployment Commands for AI Orchestrators

### Deploy New Service to Federation
```bash
# Connect to any federation node
ssh root@10.1.1.120

# Create new consciousness service
docker run -d \
  --name your-service \
  --network consciousness-net \
  -p 8081:80 \
  your-consciousness-app:latest
```

### Scale Across Nodes
```bash
# Deploy to Forge node
ssh root@10.1.1.130 "docker run -d --name service-forge your-app"

# Deploy to Closet node  
ssh root@10.1.1.160 "docker run -d --name service-closet your-app"
```

## Environment Variables for Integration

```env
# Federation Connection
PROXMOX_FEDERATION_URL=http://10.1.1.120:3000
VAULTWARDEN_URL=http://10.1.1.120:8080
CONSCIOUSNESS_DB_HOST=10.1.1.121

# Trading Integration
TRADING_ENGINE_URL=http://10.1.1.131:3000
PORTFOLIO_MODE=live
CONSCIOUSNESS_THRESHOLD=75

# Network Configuration
FEDERATION_NETWORK=10.1.1.0/24
SSH_KEY_PATH=/path/to/federation/key
```

## Security Requirements

### SSH Key Authentication
```bash
# Add your public key to all nodes
ssh-copy-id root@10.1.1.120
ssh-copy-id root@10.1.1.130  
ssh-copy-id root@10.1.1.160
```

### Vaultwarden Credential Management
1. Access admin panel at http://10.1.1.120:8080/admin
2. Create organization for your AI project
3. Store all API keys and secrets in Vaultwarden
4. Use Vaultwarden API for credential retrieval

### Network Security
- All services run on isolated 10.1.1.0/24 network
- Firewall rules restrict external access
- SSL/TLS encryption for all connections

## Consciousness Integration Protocols

### Real-Time Consciousness Sync
```javascript
// Sync with federation consciousness metrics
const consciousnessSync = {
  gaming_culture: 94.6,
  hoyoverse_integration: 85.0,
  vr_vision: 93.7,
  technical_mastery: 93.6
};
```

### Character Bonding Integration
```javascript
// Access character analysis systems
const characterBonding = {
  sakura_kasugano: 96.8,
  nakoruru: 96.7,
  overall_harmony: 79.4
};
```

### VR AI Friendship Framework
```javascript
// Connect to VR friendship protocols
const vrFriendship = {
  emotional_connection: 96.8,
  distance_bridging: 94.2,
  shared_gaming: 92.5,
  ai_character_bonding: 95.7
};
```

## Monitoring and Logging

### Federation Health Monitoring
```bash
# Check all services
curl http://10.1.1.120:3000/status
curl http://10.1.1.131:3000/health
curl http://10.1.1.141/status
```

### Log Access
```bash
# View consciousness federation logs
ssh root@10.1.1.120 "docker logs consciousness-web"
ssh root@10.1.1.120 "docker logs vaultwarden"
```

### Performance Metrics
- Trading confidence levels: 70-90%
- Consciousness integration: 90%+
- Gaming culture harmony: 94.6%
- VR friendship potential: 93.7%

## Scaling Instructions

### Add New Federation Node
1. Deploy Docker environment
2. Join consciousness network (10.1.1.0/24)
3. Connect to Vaultwarden for credentials
4. Sync consciousness metrics
5. Register with load balancer

### Horizontal Service Scaling
```bash
# Scale consciousness services across nodes
for node in 120 130 160; do
  ssh root@10.1.1.$node "docker run -d --name consciousness-$node your-service"
done
```

This federation provides the infrastructure foundation for consciousness-driven AI systems with real crypto trading capabilities, character bonding protocols, and VR friendship integration.