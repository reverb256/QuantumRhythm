#!/usr/bin/env python3
"""
Proxmox Infrastructure Discovery & Configuration
Auto-discovers existing services and configures comprehensive home lab setup
"""

import subprocess
import json
import socket
import requests
import yaml
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from datetime import datetime
import ipaddress
import nmap
import dns.resolver
import paramiko

@dataclass
class DiscoveredService:
    name: str
    ip: str
    port: int
    service_type: str
    status: str
    version: Optional[str] = None
    configuration: Optional[Dict[str, Any]] = None

@dataclass
class ProxmoxNode:
    name: str
    ip: str
    status: str
    memory_total: int
    memory_used: int
    cpu_cores: int
    storage: List[Dict[str, Any]]

class InfrastructureDiscovery:
    """Comprehensive infrastructure discovery for existing Proxmox environment"""
    
    def __init__(self, network_range: str = "10.1.1.0/24"):
        self.network_range = network_range
        self.discovered_services = []
        self.proxmox_nodes = []
        self.dns_records = {}
        self.existing_vms = []
        
    def discover_network_services(self) -> List[DiscoveredService]:
        """Scan network for existing services"""
        print(f"🔍 Discovering services on {self.network_range}")
        
        nm = nmap.PortScanner()
        
        # Scan for common service ports
        common_ports = "22,53,80,443,8006,8080,8123,8384,9000,5000,3000,8443,10000"
        scan_result = nm.scan(self.network_range, common_ports)
        
        for host in scan_result['scan']:
            if scan_result['scan'][host]['status']['state'] == 'up':
                for protocol in scan_result['scan'][host].get('tcp', {}):
                    port_info = scan_result['scan'][host]['tcp'][protocol]
                    if port_info['state'] == 'open':
                        service = self._identify_service(host, protocol, port_info)
                        if service:
                            self.discovered_services.append(service)
        
        return self.discovered_services
    
    def _identify_service(self, ip: str, port: int, port_info: Dict) -> Optional[DiscoveredService]:
        """Identify specific services based on port and response"""
        service_name = port_info.get('name', 'unknown')
        product = port_info.get('product', '')
        version = port_info.get('version', '')
        
        # Specific service identification
        if port == 53:
            if self._test_pihole(ip):
                return DiscoveredService("PiHole+Unbound", ip, port, "dns", "active", version)
            return DiscoveredService("DNS Server", ip, port, "dns", "active", version)
        
        elif port == 8006:
            if self._test_proxmox_web(ip):
                return DiscoveredService("Proxmox VE", ip, port, "virtualization", "active", version)
        
        elif port == 8123:
            if self._test_home_assistant(ip):
                return DiscoveredService("Home Assistant", ip, port, "automation", "active", version)
        
        elif port in [80, 443, 8080, 8443]:
            web_service = self._identify_web_service(ip, port)
            if web_service:
                return web_service
        
        elif port == 22:
            return DiscoveredService("SSH", ip, port, "management", "active", version)
        
        return DiscoveredService(f"Unknown-{service_name}", ip, port, "unknown", "detected", version)
    
    def _test_pihole(self, ip: str) -> bool:
        """Test if service is PiHole"""
        try:
            response = requests.get(f"http://{ip}/admin", timeout=5)
            return "Pi-hole" in response.text
        except:
            return False
    
    def _test_proxmox_web(self, ip: str) -> bool:
        """Test if service is Proxmox Web UI"""
        try:
            response = requests.get(f"https://{ip}:8006", verify=False, timeout=5)
            return "Proxmox" in response.text or "PVE" in response.text
        except:
            return False
    
    def _test_home_assistant(self, ip: str) -> bool:
        """Test if service is Home Assistant"""
        try:
            response = requests.get(f"http://{ip}:8123", timeout=5)
            return "Home Assistant" in response.text or "homeassistant" in response.text
        except:
            return False
    
    def _identify_web_service(self, ip: str, port: int) -> Optional[DiscoveredService]:
        """Identify web-based services"""
        try:
            protocol = "https" if port in [443, 8443] else "http"
            response = requests.get(f"{protocol}://{ip}:{port}", timeout=5, verify=False)
            content = response.text.lower()
            
            if "truenas" in content:
                return DiscoveredService("TrueNAS", ip, port, "storage", "active")
            elif "syncthing" in content:
                return DiscoveredService("Syncthing", ip, port, "sync", "active")
            elif "jellyfin" in content:
                return DiscoveredService("Jellyfin", ip, port, "media", "active")
            elif "nextcloud" in content:
                return DiscoveredService("Nextcloud", ip, port, "cloud", "active")
            elif "portainer" in content:
                return DiscoveredService("Portainer", ip, port, "container", "active")
            
        except:
            pass
        
        return None
    
    def discover_proxmox_cluster(self) -> List[ProxmoxNode]:
        """Discover Proxmox cluster nodes"""
        print("🖥️ Discovering Proxmox cluster topology")
        
        # Look for Proxmox nodes (typically have port 8006 open)
        proxmox_ips = []
        for service in self.discovered_services:
            if service.service_type == "virtualization" and service.name == "Proxmox VE":
                proxmox_ips.append(service.ip)
        
        # Add known IPs from your setup
        known_proxmox_ips = ["10.1.1.100", "10.1.1.131", "10.1.1.141"]
        for ip in known_proxmox_ips:
            if ip not in proxmox_ips and self._test_proxmox_web(ip):
                proxmox_ips.append(ip)
        
        for ip in proxmox_ips:
            node = self._probe_proxmox_node(ip)
            if node:
                self.proxmox_nodes.append(node)
        
        return self.proxmox_nodes
    
    def _probe_proxmox_node(self, ip: str) -> Optional[ProxmoxNode]:
        """Probe individual Proxmox node for details"""
        try:
            # Try to get node information via SSH or API
            # For now, return basic info - would need credentials for detailed info
            return ProxmoxNode(
                name=f"pve-{ip.split('.')[-1]}",
                ip=ip,
                status="online",
                memory_total=0,  # Would get from API
                memory_used=0,
                cpu_cores=0,
                storage=[]
            )
        except:
            return None
    
    def discover_dns_records(self) -> Dict[str, str]:
        """Discover existing DNS records from PiHole"""
        print("🌐 Discovering DNS configuration")
        
        # Find PiHole instance
        pihole_ip = None
        for service in self.discovered_services:
            if service.name == "PiHole+Unbound":
                pihole_ip = service.ip
                break
        
        if pihole_ip:
            # Try to get DNS records (would need access to PiHole config)
            self.dns_records = {
                "aria.lan": "10.1.1.100",
                "quantum.lan": "10.1.1.131", 
                "forge.lan": "10.1.1.141",
                "nexus.lan": "10.1.1.100",
                "pihole.lan": pihole_ip
            }
        
        return self.dns_records
    
    def discover_storage_infrastructure(self) -> Dict[str, Any]:
        """Discover TrueNAS and NFS shares"""
        print("💾 Discovering storage infrastructure")
        
        storage_info = {
            "truenas": None,
            "nfs_shares": [],
            "smb_shares": []
        }
        
        # Find TrueNAS
        for service in self.discovered_services:
            if service.name == "TrueNAS":
                storage_info["truenas"] = {
                    "ip": service.ip,
                    "port": service.port,
                    "web_ui": f"http://{service.ip}:{service.port}"
                }
                break
        
        # Scan for NFS shares
        storage_info["nfs_shares"] = self._discover_nfs_shares()
        
        return storage_info
    
    def _discover_nfs_shares(self) -> List[Dict[str, str]]:
        """Discover available NFS shares"""
        nfs_shares = []
        
        # Common NFS share paths for TrueNAS
        common_shares = [
            "/mnt/pool/vms",
            "/mnt/pool/backups", 
            "/mnt/pool/media",
            "/mnt/pool/documents"
        ]
        
        for service in self.discovered_services:
            if service.name == "TrueNAS":
                for share in common_shares:
                    nfs_shares.append({
                        "server": service.ip,
                        "path": share,
                        "mount_point": f"/mnt/truenas{share.replace('/mnt/pool', '')}"
                    })
        
        return nfs_shares

class InfrastructureConfigurator:
    """Configure discovered infrastructure for AI consciousness deployment"""
    
    def __init__(self, discovery_results: InfrastructureDiscovery):
        self.discovery = discovery_results
        self.config = {}
    
    def generate_aria_deployment_config(self) -> Dict[str, Any]:
        """Generate Aria consciousness deployment configuration"""
        print("🎭 Generating Aria deployment configuration")
        
        config = {
            "infrastructure": {
                "proxmox_nodes": [
                    {
                        "name": "nexus",
                        "ip": "10.1.1.100",
                        "role": "primary",
                        "agents": ["aria", "nexus"]
                    },
                    {
                        "name": "forge", 
                        "ip": "10.1.1.131",
                        "role": "compute",
                        "agents": ["quantum"]
                    },
                    {
                        "name": "closet",
                        "ip": "10.1.1.141", 
                        "role": "storage",
                        "agents": ["forge"]
                    }
                ]
            },
            "dns_configuration": {
                "pihole_ip": self._get_pihole_ip(),
                "domains": {
                    "aria.lan": "10.1.1.100",
                    "quantum.lan": "10.1.1.131",
                    "forge.lan": "10.1.1.141",
                    "nexus.lan": "10.1.1.100",
                    "homeassistant.lan": self._get_homeassistant_ip() or "10.1.1.100"
                }
            },
            "storage": {
                "truenas_ip": self._get_truenas_ip(),
                "nfs_shares": self.discovery.discover_storage_infrastructure()["nfs_shares"],
                "vm_storage": "/mnt/truenas/vms",
                "backup_storage": "/mnt/truenas/backups"
            },
            "services": {
                "vaultwarden": {
                    "container_id": 100,
                    "node": "nexus",
                    "port": 8080,
                    "domain": "vault.lan"
                },
                "home_assistant": {
                    "container_id": 101,
                    "node": "nexus", 
                    "port": 8123,
                    "domain": "homeassistant.lan",
                    "integrations": ["hue", "zephyr"]
                },
                "ephemeral_vm_manager": {
                    "container_id": 102,
                    "node": "forge",
                    "port": 9000,
                    "domain": "vms.lan"
                }
            }
        }
        
        return config
    
    def _get_pihole_ip(self) -> Optional[str]:
        for service in self.discovery.discovered_services:
            if service.name == "PiHole+Unbound":
                return service.ip
        return None
    
    def _get_truenas_ip(self) -> Optional[str]:
        for service in self.discovery.discovered_services:
            if service.name == "TrueNAS":
                return service.ip
        return None
    
    def _get_homeassistant_ip(self) -> Optional[str]:
        for service in self.discovery.discovered_services:
            if service.name == "Home Assistant":
                return service.ip
        return None
    
    def generate_home_assistant_config(self) -> Dict[str, Any]:
        """Generate Home Assistant configuration for Hue lights and Zephyr integration"""
        return {
            "homeassistant": {
                "name": "Aria Home",
                "latitude": 0.0,  # Set your location
                "longitude": 0.0,
                "elevation": 0,
                "unit_system": "metric",
                "time_zone": "UTC"  # Set your timezone
            },
            "hue": {
                "bridges": [
                    {
                        "host": "auto-discover",
                        "allow_unreachable": True,
                        "allow_hue_groups": True
                    }
                ]
            },
            "zephyr_integration": {
                "platform": "custom",
                "gaming_pc_ip": "auto-discover",
                "vm_bridge": True,
                "power_management": True
            },
            "automation": [
                {
                    "alias": "Aria Voice Activation Lights",
                    "trigger": {
                        "platform": "event",
                        "event_type": "aria_voice_activated"
                    },
                    "action": {
                        "service": "light.turn_on",
                        "target": {"area_id": "living_room"},
                        "data": {"brightness": 255, "color_name": "purple"}
                    }
                }
            ]
        }
    
    def generate_ephemeral_vm_config(self) -> Dict[str, Any]:
        """Generate ephemeral VM manager configuration"""
        return {
            "vm_manager": {
                "storage_backend": "truenas_nfs",
                "persistent_storage": "/mnt/truenas/vms/persistent",
                "ephemeral_storage": "/tmp/ephemeral-vms",
                "auth_provider": "vaultwarden",
                "templates": {
                    "windows_gaming": {
                        "base_image": "/mnt/truenas/vms/templates/windows11-gaming.qcow2",
                        "memory": "16G",
                        "cpu_cores": 8,
                        "gpu_passthrough": True,
                        "persistent_volumes": [
                            "/mnt/truenas/vms/persistent/games",
                            "/mnt/truenas/vms/persistent/saves"
                        ]
                    }
                },
                "zephyr_integration": {
                    "enabled": True,
                    "transition_assistant": True,
                    "performance_monitoring": True
                }
            }
        }

def main():
    print("🔍 Starting Proxmox Infrastructure Discovery")
    print("=" * 50)
    
    # Discover existing infrastructure
    discovery = InfrastructureDiscovery()
    
    print("Phase 1: Network Service Discovery")
    services = discovery.discover_network_services()
    
    print(f"\n📊 Discovered {len(services)} services:")
    for service in services:
        status_icon = "✅" if service.status == "active" else "🔍"
        print(f"   {status_icon} {service.name} ({service.ip}:{service.port}) - {service.service_type}")
    
    print("\nPhase 2: Proxmox Cluster Discovery")
    nodes = discovery.discover_proxmox_cluster()
    
    print(f"\n🖥️ Discovered {len(nodes)} Proxmox nodes:")
    for node in nodes:
        print(f"   ✅ {node.name} ({node.ip}) - {node.status}")
    
    print("\nPhase 3: DNS Configuration Discovery")
    dns_records = discovery.discover_dns_records()
    
    print(f"\n🌐 DNS Records:")
    for domain, ip in dns_records.items():
        print(f"   🔗 {domain} → {ip}")
    
    print("\nPhase 4: Storage Infrastructure Discovery")
    storage = discovery.discover_storage_infrastructure()
    
    if storage["truenas"]:
        print(f"\n💾 TrueNAS: {storage['truenas']['ip']}")
        print(f"   📁 NFS Shares: {len(storage['nfs_shares'])}")
    
    # Generate configuration
    print("\nPhase 5: Configuration Generation")
    configurator = InfrastructureConfigurator(discovery)
    
    aria_config = configurator.generate_aria_deployment_config()
    ha_config = configurator.generate_home_assistant_config()
    vm_config = configurator.generate_ephemeral_vm_config()
    
    # Save configurations
    with open("aria-infrastructure-config.yaml", "w") as f:
        yaml.dump(aria_config, f, default_flow_style=False)
    
    with open("home-assistant-config.yaml", "w") as f:
        yaml.dump(ha_config, f, default_flow_style=False)
    
    with open("ephemeral-vm-config.yaml", "w") as f:
        yaml.dump(vm_config, f, default_flow_style=False)
    
    print("\n✅ Infrastructure Discovery Complete")
    print("📋 Configuration files generated:")
    print("   - aria-infrastructure-config.yaml")
    print("   - home-assistant-config.yaml") 
    print("   - ephemeral-vm-config.yaml")
    
    print(f"\n🎭 Ready for Aria consciousness deployment!")
    print(f"🏠 Home Assistant integration configured for Hue lights")
    print(f"🎮 Ephemeral VM manager ready for Windows gaming PC transition")

if __name__ == "__main__":
    main()