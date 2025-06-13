# K3s High Availability Deployment Guide

## Overview
This deployment provides a production-ready Kubernetes cluster using K3s with self-healing capabilities and intelligent static content offloading across edge networks.

## Architecture Components

### Core Infrastructure
- **K3s Cluster**: Lightweight Kubernetes with embedded etcd for HA
- **Self-Healing Controller**: Monitors cluster health and auto-recovers from failures
- **Hyperscale Offloader**: Distributes static content across Cloudflare Workers, Vercel Edge, and Netlify
- **Load Balancer**: HAProxy for API server high availability
- **SSL Management**: Automatic certificate provisioning via cert-manager

### Monitoring Stack
- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization and dashboards
- **Traefik**: Ingress controller with automatic HTTPS

## Quick Start

### 1. Single Node Deployment (Development)
```bash
chmod +x k3s-setup.sh
sudo ./k3s-setup.sh
```

### 2. Multi-Node HA Deployment (Production)
```bash
# On master nodes (run on 3 separate servers)
curl -sfL https://get.k3s.io | sh -s - server \
  --cluster-init \
  --token=quantum-ai-cluster-token \
  --tls-san=quantum-trading.ai

# On worker nodes
curl -sfL https://get.k3s.io | K3S_URL=https://<MASTER_IP>:6443 \
  K3S_TOKEN=quantum-ai-cluster-token sh -

# Deploy the application
kubectl apply -f k3s-ha-deployment.yaml
```

### 3. Docker Compose Alternative
```bash
# For local development with K3s simulation
docker-compose -f docker-compose.k3s.yml up -d
```

## Configuration

### Environment Variables
```bash
# Required for production
export DATABASE_URL="postgresql://user:pass@host:5432/quantum_trading"
export SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
export CLOUDFLARE_API_TOKEN="your_token"
export VERCEL_TOKEN="your_token"
export NETLIFY_TOKEN="your_token"

# Optional for enhanced features
export GRAFANA_PASSWORD="secure_password"
export POSTGRES_PASSWORD="secure_password"
```

### Edge Deployment Configuration
The hyperscale offloader automatically deploys static pages to:
- **Cloudflare Workers**: Global edge network with 15ms latency
- **Vercel Edge Functions**: Regional deployment with 25ms latency
- **Netlify Edge Functions**: CDN-optimized with 35ms latency

## Self-Healing Features

### Automatic Recovery
- **Failed Pods**: Automatically restarts crashed containers
- **Node Issues**: Drains and recovers unresponsive nodes
- **Resource Pressure**: Scales deployments based on CPU/memory usage
- **API Failures**: Switches to backup endpoints with zero downtime

### Health Monitoring
- Cluster health checks every 30 seconds
- Deep system validation every 5 minutes
- External API monitoring with failover routing
- SSL certificate expiration tracking

## Scaling Configuration

### Horizontal Pod Autoscaling
- **Frontend**: 2-10 replicas based on CPU (70%) and memory (80%)
- **Backend**: 2-6 replicas based on CPU (80%) and memory (85%)
- **Database**: Single instance with backup replicas

### Resource Limits
```yaml
Frontend:
  requests: 64Mi memory, 50m CPU
  limits: 128Mi memory, 100m CPU

Backend:
  requests: 256Mi memory, 200m CPU
  limits: 512Mi memory, 500m CPU
```

## Static Content Optimization

### Build Process
```bash
# Build optimized static pages
npm run build:static

# The system automatically:
# - Minifies HTML/CSS/JS
# - Inlines critical CSS
# - Generates service workers
# - Optimizes images
# - Creates edge-deployable bundles
```

### Cache Strategy
- **Critical pages** (/, /projects): 24-hour aggressive caching
- **Standard pages**: 1-hour normal caching
- **API responses**: No caching, real-time data

## Monitoring & Observability

### Access URLs
- **Application**: https://quantum-trading.ai
- **API**: https://api.quantum-trading.ai
- **Grafana**: https://grafana.quantum-trading.ai
- **Traefik Dashboard**: https://traefik.quantum-trading.ai/dashboard/

### Key Metrics
- Cluster health status and node availability
- Pod restart counts and failure rates
- API response times and error rates
- Edge deployment success rates
- Database connection health

## Backup & Recovery

### Automated Backups
- **Cluster State**: Daily Velero backups to S3
- **Database**: Continuous WAL archiving
- **Configuration**: Git-based version control
- **Secrets**: Encrypted backup storage

### Recovery Procedures
```bash
# Restore from backup
velero restore create --from-backup daily-backup-20231201

# Manual pod recovery
kubectl delete pod <failed-pod> --force --grace-period=0

# Node maintenance
kubectl drain <node-name> --ignore-daemonsets
kubectl uncordon <node-name>
```

## Security Features

### Network Policies
- Namespace isolation between components
- Ingress traffic restricted to necessary ports
- Pod-to-pod communication controls

### Secrets Management
- Kubernetes secrets for sensitive data
- Automatic SSL certificate rotation
- API key rotation capabilities

## Troubleshooting

### Common Issues
1. **Pods stuck in Pending**: Check resource availability
2. **SSL certificate failures**: Verify DNS configuration
3. **Edge deployment failures**: Check API tokens
4. **Database connection issues**: Verify network policies

### Debug Commands
```bash
# Check cluster status
kubectl get nodes
kubectl get pods --all-namespaces

# View logs
kubectl logs -f deployment/quantum-ai-backend -n quantum-trading-platform

# Check self-healing status
kubectl get events --sort-by=.metadata.creationTimestamp
```

## Performance Optimization

### Edge Network Selection
The system automatically selects the best edge network based on:
- Geographic proximity to users
- Current network latency
- Reliability scores
- Available capacity

### Traffic Distribution
- 60% Cloudflare Workers (primary)
- 25% Vercel Edge (secondary)
- 15% Netlify Edge (tertiary)

## Maintenance

### Regular Tasks
- Monitor certificate expiration (automated)
- Review resource usage and scaling policies
- Update security policies and network rules
- Validate backup integrity

### Updates
```bash
# Update K3s cluster
sudo systemctl stop k3s
curl -sfL https://get.k3s.io | sh -
sudo systemctl start k3s

# Update application
kubectl set image deployment/quantum-ai-backend backend=new-image:tag
kubectl rollout status deployment/quantum-ai-backend
```

This deployment ensures zero-downtime operation with automatic failover, intelligent load balancing, and global edge distribution for optimal performance.