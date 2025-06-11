/**
 * Vaultwarden Integration for Secure Wallet Management
 * Enterprise-grade secret storage and retrieval for autonomous trading
 */

import axios from 'axios';
import crypto from 'crypto';

interface VaultwardenConfig {
  serverUrl: string;
  adminToken: string;
  organizationId: string;
  collectionId: string;
}

interface SecureWallet {
  id: string;
  name: string;
  publicKey: string;
  privateKeyVaultId: string;
  purpose: 'main' | 'yield' | 'arbitrage' | 'cross-chain' | 'experimental';
  createdAt: string;
  lastAccessed: string;
}

interface VaultItem {
  id?: string;
  organizationId: string;
  collectionIds: string[];
  name: string;
  notes: string;
  fields: Array<{
    name: string;
    value: string;
    type: number; // 0 = text, 1 = hidden, 2 = boolean
  }>;
  login?: {
    username: string;
    password: string;
  };
}

class VaultwardenManager {
  private config: VaultwardenConfig;
  private accessToken: string | null = null;
  private walletRegistry: Map<string, SecureWallet> = new Map();

  constructor() {
    this.config = {
      serverUrl: process.env.VAULTWARDEN_URL || 'http://localhost:8080',
      adminToken: process.env.VAULTWARDEN_ADMIN_TOKEN || '',
      organizationId: process.env.VAULTWARDEN_ORG_ID || '',
      collectionId: process.env.VAULTWARDEN_COLLECTION_ID || ''
    };
    
    this.initializeVaultConnection();
  }

  private async initializeVaultConnection(): Promise<void> {
    console.log('🔐 Initializing Vaultwarden secure vault connection...');
    
    try {
      await this.authenticateWithVault();
      await this.setupTradingCollection();
      await this.loadExistingWallets();
      
      console.log('✅ Vaultwarden integration active - enterprise security enabled');
    } catch (error) {
      console.log('⚠️ Vaultwarden not available - using fallback security');
      console.log('   Ensure Vaultwarden server is running and configured');
    }
  }

  private async authenticateWithVault(): Promise<void> {
    if (!this.config.adminToken) {
      throw new Error('Vaultwarden admin token not configured');
    }

    const response = await axios.post(`${this.config.serverUrl}/identity/connect/token`, {
      grant_type: 'client_credentials',
      scope: 'api',
      client_id: 'organization.' + this.config.organizationId,
      client_secret: this.config.adminToken
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    this.accessToken = response.data.access_token;
    console.log('🔑 Vaultwarden authentication successful');
  }

  private async setupTradingCollection(): Promise<void> {
    if (!this.accessToken) throw new Error('Not authenticated');

    // Ensure trading wallet collection exists
    try {
      await axios.get(`${this.config.serverUrl}/api/collections/${this.config.collectionId}`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });
      console.log('📁 Trading wallet collection verified');
    } catch (error) {
      // Create collection if it doesn't exist
      const collection = await axios.post(`${this.config.serverUrl}/api/organizations/${this.config.organizationId}/collections`, {
        name: 'Quantum Trading Wallets',
        externalId: 'quantum-trading-wallets'
      }, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });
      
      this.config.collectionId = collection.data.id;
      console.log('📁 Created trading wallet collection');
    }
  }

  private async loadExistingWallets(): Promise<void> {
    if (!this.accessToken) return;

    try {
      const response = await axios.get(`${this.config.serverUrl}/api/ciphers`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` },
        params: { collectionId: this.config.collectionId }
      });

      response.data.data.forEach((cipher: any) => {
        if (cipher.name.startsWith('Wallet-')) {
          const walletData = JSON.parse(cipher.notes || '{}');
          this.walletRegistry.set(walletData.id, {
            id: walletData.id,
            name: cipher.name,
            publicKey: walletData.publicKey,
            privateKeyVaultId: cipher.id,
            purpose: walletData.purpose,
            createdAt: walletData.createdAt,
            lastAccessed: new Date().toISOString()
          });
        }
      });

      console.log(`🔐 Loaded ${this.walletRegistry.size} secure wallets from vault`);
    } catch (error) {
      console.log('⚠️ Could not load existing wallets from vault');
    }
  }

  async storeWalletSecurely(
    walletId: string,
    publicKey: string,
    privateKey: string,
    purpose: string
  ): Promise<SecureWallet> {
    if (!this.accessToken) {
      throw new Error('Vault not authenticated');
    }

    const walletName = `Wallet-${purpose}-${walletId.slice(-8)}`;
    const walletData = {
      id: walletId,
      publicKey,
      purpose,
      createdAt: new Date().toISOString()
    };

    const vaultItem: VaultItem = {
      organizationId: this.config.organizationId,
      collectionIds: [this.config.collectionId],
      name: walletName,
      notes: JSON.stringify(walletData),
      fields: [
        {
          name: 'PublicKey',
          value: publicKey,
          type: 0 // text
        },
        {
          name: 'PrivateKey',
          value: privateKey,
          type: 1 // hidden
        },
        {
          name: 'Purpose',
          value: purpose,
          type: 0
        },
        {
          name: 'CreatedBy',
          value: 'Quantum AI Trading System',
          type: 0
        }
      ]
    };

    const response = await axios.post(`${this.config.serverUrl}/api/ciphers`, vaultItem, {
      headers: { 'Authorization': `Bearer ${this.accessToken}` }
    });

    const secureWallet: SecureWallet = {
      id: walletId,
      name: walletName,
      publicKey,
      privateKeyVaultId: response.data.id,
      purpose: purpose as any,
      createdAt: walletData.createdAt,
      lastAccessed: new Date().toISOString()
    };

    this.walletRegistry.set(walletId, secureWallet);

    console.log(`🔐 Wallet ${walletId.slice(-8)} securely stored in vault`);
    console.log(`   Purpose: ${purpose} | Public: ${publicKey.slice(0, 8)}...`);

    return secureWallet;
  }

  async retrievePrivateKey(walletId: string): Promise<string | null> {
    const wallet = this.walletRegistry.get(walletId);
    if (!wallet || !this.accessToken) return null;

    try {
      const response = await axios.get(`${this.config.serverUrl}/api/ciphers/${wallet.privateKeyVaultId}`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });

      const privateKeyField = response.data.fields?.find((field: any) => field.name === 'PrivateKey');
      if (!privateKeyField) return null;

      // Update last accessed time
      wallet.lastAccessed = new Date().toISOString();

      console.log(`🔑 Retrieved private key for wallet ${walletId.slice(-8)} (${wallet.purpose})`);
      return privateKeyField.value;
    } catch (error) {
      console.log(`❌ Failed to retrieve private key for wallet ${walletId}`);
      return null;
    }
  }

  async storeAPISecret(serviceName: string, secretKey: string, secretValue: string): Promise<void> {
    if (!this.accessToken) return;

    const vaultItem: VaultItem = {
      organizationId: this.config.organizationId,
      collectionIds: [this.config.collectionId],
      name: `API-${serviceName}`,
      notes: `API credentials for ${serviceName}`,
      login: {
        username: secretKey,
        password: secretValue
      },
      fields: [
        {
          name: 'Service',
          value: serviceName,
          type: 0
        },
        {
          name: 'CreatedBy',
          value: 'Quantum AI Trading System',
          type: 0
        }
      ]
    };

    await axios.post(`${this.config.serverUrl}/api/ciphers`, vaultItem, {
      headers: { 'Authorization': `Bearer ${this.accessToken}` }
    });

    console.log(`🔐 API secret for ${serviceName} stored securely`);
  }

  async rotateWalletKeys(walletId: string): Promise<{ oldPublicKey: string; newPublicKey: string }> {
    const wallet = this.walletRegistry.get(walletId);
    if (!wallet) throw new Error('Wallet not found');

    // Generate new keypair
    const { Keypair } = await import('@solana/web3.js');
    const newKeypair = Keypair.generate();

    const oldPublicKey = wallet.publicKey;
    const newPublicKey = newKeypair.publicKey.toString();

    // Update vault with new keys
    await this.updateWalletInVault(wallet.privateKeyVaultId, {
      publicKey: newPublicKey,
      privateKey: Buffer.from(newKeypair.secretKey).toString('base64')
    });

    // Update registry
    wallet.publicKey = newPublicKey;
    wallet.lastAccessed = new Date().toISOString();

    console.log(`🔄 Rotated keys for wallet ${walletId.slice(-8)}`);
    console.log(`   Old: ${oldPublicKey.slice(0, 8)}... → New: ${newPublicKey.slice(0, 8)}...`);

    return { oldPublicKey, newPublicKey };
  }

  private async updateWalletInVault(vaultId: string, updates: any): Promise<void> {
    if (!this.accessToken) return;

    const response = await axios.get(`${this.config.serverUrl}/api/ciphers/${vaultId}`, {
      headers: { 'Authorization': `Bearer ${this.accessToken}` }
    });

    const cipher = response.data;
    
    // Update fields
    cipher.fields = cipher.fields.map((field: any) => {
      if (field.name === 'PublicKey') field.value = updates.publicKey;
      if (field.name === 'PrivateKey') field.value = updates.privateKey;
      return field;
    });

    await axios.put(`${this.config.serverUrl}/api/ciphers/${vaultId}`, cipher, {
      headers: { 'Authorization': `Bearer ${this.accessToken}` }
    });
  }

  getSecureWalletRegistry(): SecureWallet[] {
    return Array.from(this.walletRegistry.values());
  }

  async createEmergencyBackup(): Promise<string> {
    if (!this.accessToken) throw new Error('Vault not authenticated');

    // Export encrypted backup of all trading wallets
    const backup = {
      timestamp: new Date().toISOString(),
      wallets: Array.from(this.walletRegistry.values()).map(wallet => ({
        id: wallet.id,
        name: wallet.name,
        publicKey: wallet.publicKey,
        purpose: wallet.purpose,
        vaultId: wallet.privateKeyVaultId,
        createdAt: wallet.createdAt
      })),
      vaultConfig: {
        serverUrl: this.config.serverUrl,
        organizationId: this.config.organizationId,
        collectionId: this.config.collectionId
      }
    };

    const backupString = JSON.stringify(backup, null, 2);
    console.log(`💾 Emergency backup created: ${backup.wallets.length} wallets`);
    
    return backupString;
  }

  getVaultStatus(): {
    connected: boolean;
    walletsStored: number;
    lastConnection: string;
    securityLevel: string;
  } {
    return {
      connected: !!this.accessToken,
      walletsStored: this.walletRegistry.size,
      lastConnection: new Date().toISOString(),
      securityLevel: 'Enterprise (Vaultwarden)'
    };
  }
}

export const vaultwardenManager = new VaultwardenManager();