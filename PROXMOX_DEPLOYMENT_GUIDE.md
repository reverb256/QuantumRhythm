# Quantum AI Trading Platform - Proxmox Deployment Guide

## Prerequisites

- Proxmox VE server with Portainer installed
- Podman configured as container runtime
- At least 4GB RAM and 2 CPU cores available
- Network access to container registries

## Environment Variables Required

Create these environment variables in Portainer before deployment:

```bash
POSTGRES_PASSWORD=your_secure_database_password
WALLET_PRIVATE_KEY=your_solana_wallet_private_key
PERPLEXITY_API_KEY=your_perplexity_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
TWITTER_USERNAME=your_twitter_username
TWITTER_PASSWORD=your_twitter_password
JUPITER_API_KEY=your_jupiter_api_key
CMC_API_KEY=your_coinmarketcap_api_key
MORALIS_API_KEY=your_moralis_api_key
```

## Deployment Steps

### Option 1: Portainer Stack Deployment

1. **Build the Docker Image**:
   ```bash
   # On your build machine or CI/CD
   podman build -t quantum-ai-trading-platform:latest .
   podman tag quantum-ai-trading-platform:latest your-registry/quantum-ai-trading-platform:latest
   podman push your-registry/quantum-ai-trading-platform:latest
   ```

2. **Deploy via Portainer**:
   - Access Portainer web interface
   - Navigate to "Stacks" → "Add Stack"
   - Name: `quantum-ai-trading`
   - Upload `portainer-stack.yml`
   - Set environment variables in the "Environment variables" section
   - Click "Deploy the stack"

### Option 2: Podman Compose Deployment

1. **Transfer files to Proxmox**:
   ```bash
   scp -r . root@your-proxmox-server:/opt/quantum-ai-trading/
   ```

2. **Run deployment**:
   ```bash
   cd /opt/quantum-ai-trading/
   podman-compose -f podman-compose.yml up -d
   ```

## Post-Deployment Configuration

### 1. SSL Certificate Setup (Optional)

Generate self-signed certificates or use Let's Encrypt:

```bash
# Self-signed certificate
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=your-domain.com"
```

### 2. Database Initialization

The database will auto-initialize on first run with the SQL scripts in `database/init/`.

### 3. Health Checks

Monitor deployment health:

```bash
# Check container status
podman ps

# Check application health
curl http://localhost:5000/api/health

# View logs
podman logs quantum-ai-trading-platform
```

## Network Configuration

The stack exposes these ports:
- **5000**: Main application (HTTP/HTTPS via nginx)
- **5432**: PostgreSQL database
- **6379**: Redis cache

## Resource Requirements

| Service | CPU | RAM | Storage |
|---------|-----|-----|---------|
| AI Trader | 1.0 cores | 2GB | 1GB |
| PostgreSQL | 0.5 cores | 1GB | 5GB |
| Redis | 0.2 cores | 512MB | 1GB |
| **Total** | **1.7 cores** | **3.5GB** | **7GB** |

## Monitoring and Maintenance

### Log Management

Logs are stored in named volumes:
```bash
# Access application logs
podman exec -it quantum-ai-trading-platform tail -f /app/logs/app.log

# Database logs
podman logs quantum-ai-database
```

### Backup Strategy

```bash
# Database backup
podman exec quantum-ai-database pg_dump -U trader quantum_trading > backup_$(date +%Y%m%d).sql

# Volume backup
podman volume export quantum-logs > logs_backup_$(date +%Y%m%d).tar
```

### Updates

```bash
# Pull latest image
podman pull your-registry/quantum-ai-trading-platform:latest

# Restart stack
podman-compose down && podman-compose up -d
```

## Security Considerations

1. **Environment Variables**: Store sensitive data in Portainer secrets
2. **Network**: Use firewall rules to restrict access
3. **SSL**: Enable HTTPS with valid certificates
4. **Updates**: Keep base images updated regularly

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 5000, 5432, 6379 are available
2. **Memory Issues**: Increase swap if system has <4GB RAM
3. **API Keys**: Verify all required environment variables are set
4. **Network**: Check container network connectivity

### Debug Commands

```bash
# Container inspection
podman inspect quantum-ai-trading-platform

# Network debugging
podman network ls
podman network inspect trading-network

# Resource usage
podman stats
```

## Trading Configuration

The AI trader is configured to:
- Track wallet: `4jTtAYiHP3tHqXcmi5T1riS1AcGmxNNhLZTw65vrKpkA`
- Execute live trades on Solana
- Use enhanced position sizing (5-15% allocations)
- Apply 2-3x multipliers for high-confidence opportunities

Access the trading interface at: `http://your-proxmox-ip:5000`

## Support

For deployment issues:
1. Check container logs
2. Verify environment variables
3. Ensure network connectivity
4. Monitor resource usage