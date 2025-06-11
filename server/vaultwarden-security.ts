/**
 * Vaultwarden Security Integration for AI Communications
 * Secure storage and retrieval of AI API keys and sensitive data
 */

import crypto from 'crypto';

interface VaultwardenConfig {
  serverUrl: string;
  clientId: string;
  clientSecret: string;
  organizationId?: string;
}

interface SecureAICredentials {
  anthropicApiKey?: string;
  openaiApiKey?: string;
  huggingfaceToken?: string;
  customModelEndpoints?: Record<string, string>;
  encryptionKeys?: Record<string, string>;
}

interface VaultwardenItem {
  id: string;
  name: string;
  notes?: string;
  fields: Array<{
    name: string;
    value: string;
    type: number; // 0 = text, 1 = hidden, 2 = boolean
  }>;
  login?: {
    username: string;
    password: string;
    uris: Array<{ uri: string; match?: number }>;
  };
}

export class VaultwardenSecurityManager {
  private config: VaultwardenConfig;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private encryptionKey: Buffer;
  private tokenExpiry: number = 0;

  constructor(config: VaultwardenConfig) {
    this.config = config;
    this.encryptionKey = this.deriveEncryptionKey();
  }

  private deriveEncryptionKey(): Buffer {
    const salt = process.env.VAULTWARDEN_SALT || 'ai-trading-platform-salt';
    const secret = process.env.VAULTWARDEN_MASTER_KEY || 'default-master-key';
    return crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha256');
  }

  private encrypt(text: string): { encrypted: string; iv: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encrypted, iv: iv.toString('hex') };
  }

  private decrypt(encryptedData: { encrypted: string; iv: string }): string {
    const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async authenticate(): Promise<boolean> {
    try {
      // Check if we already have a valid token
      if (this.accessToken && Date.now() < this.tokenExpiry) {
        return true;
      }

      const response = await fetch(`${this.config.serverUrl}/identity/connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          scope: 'api'
        })
      });

      if (!response.ok) {
        console.error('Vaultwarden authentication failed:', response.status);
        return false;
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 minute buffer

      console.log('✅ Vaultwarden authentication successful');
      return true;
    } catch (error) {
      console.error('❌ Vaultwarden authentication error:', error);
      return false;
    }
  }

  async storeAICredentials(credentials: SecureAICredentials): Promise<boolean> {
    if (!await this.authenticate()) {
      return false;
    }

    try {
      const encryptedCredentials = this.encrypt(JSON.stringify(credentials));
      
      const vaultItem: Partial<VaultwardenItem> = {
        name: 'AI Trading Platform Credentials',
        notes: 'Secure storage for AI model API keys and sensitive data',
        fields: [
          {
            name: 'encrypted_credentials',
            value: JSON.stringify(encryptedCredentials),
            type: 1 // hidden field
          },
          {
            name: 'created_at',
            value: new Date().toISOString(),
            type: 0 // text field
          },
          {
            name: 'platform',
            value: 'quantum-ai-trading',
            type: 0
          }
        ]
      };

      const response = await fetch(`${this.config.serverUrl}/api/ciphers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 1, // Secure note type
          ...vaultItem,
          organizationId: this.config.organizationId || null
        })
      });

      if (!response.ok) {
        console.error('Failed to store AI credentials:', response.status);
        return false;
      }

      console.log('✅ AI credentials securely stored in Vaultwarden');
      return true;
    } catch (error) {
      console.error('❌ Error storing AI credentials:', error);
      return false;
    }
  }

  async retrieveAICredentials(): Promise<SecureAICredentials | null> {
    if (!await this.authenticate()) {
      return null;
    }

    try {
      const response = await fetch(`${this.config.serverUrl}/api/ciphers`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      });

      if (!response.ok) {
        console.error('Failed to retrieve ciphers:', response.status);
        return null;
      }

      const data = await response.json();
      const aiCredentialsItem = data.Data?.find((item: VaultwardenItem) => 
        item.name === 'AI Trading Platform Credentials'
      );

      if (!aiCredentialsItem) {
        console.log('🔍 No AI credentials found in Vaultwarden');
        return null;
      }

      const encryptedField = aiCredentialsItem.fields?.find(
        field => field.name === 'encrypted_credentials'
      );

      if (!encryptedField) {
        console.error('❌ Encrypted credentials field not found');
        return null;
      }

      const encryptedData = JSON.parse(encryptedField.value);
      const decryptedCredentials = this.decrypt(encryptedData);
      
      console.log('✅ AI credentials successfully retrieved from Vaultwarden');
      return JSON.parse(decryptedCredentials);
    } catch (error) {
      console.error('❌ Error retrieving AI credentials:', error);
      return null;
    }
  }

  async securelyStoreTemporaryKey(keyName: string, keyValue: string, ttlSeconds: number = 3600): Promise<boolean> {
    if (!await this.authenticate()) {
      return false;
    }

    try {
      const encryptedKey = this.encrypt(keyValue);
      const expiryTime = Date.now() + (ttlSeconds * 1000);

      const vaultItem: Partial<VaultwardenItem> = {
        name: `Temp Key: ${keyName}`,
        notes: `Temporary secure key - expires ${new Date(expiryTime).toISOString()}`,
        fields: [
          {
            name: 'encrypted_key',
            value: JSON.stringify(encryptedKey),
            type: 1
          },
          {
            name: 'expires_at',
            value: expiryTime.toString(),
            type: 0
          },
          {
            name: 'key_type',
            value: 'temporary',
            type: 0
          }
        ]
      };

      const response = await fetch(`${this.config.serverUrl}/api/ciphers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 1,
          ...vaultItem,
          organizationId: this.config.organizationId || null
        })
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Error storing temporary key:', error);
      return false;
    }
  }

  async retrieveTemporaryKey(keyName: string): Promise<string | null> {
    if (!await this.authenticate()) {
      return null;
    }

    try {
      const response = await fetch(`${this.config.serverUrl}/api/ciphers`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const tempKeyItem = data.Data?.find((item: VaultwardenItem) => 
        item.name === `Temp Key: ${keyName}`
      );

      if (!tempKeyItem) {
        return null;
      }

      // Check if key has expired
      const expiryField = tempKeyItem.fields?.find(field => field.name === 'expires_at');
      if (expiryField && parseInt(expiryField.value) < Date.now()) {
        // Key has expired, delete it
        await this.deleteVaultItem(tempKeyItem.id);
        return null;
      }

      const encryptedField = tempKeyItem.fields?.find(field => field.name === 'encrypted_key');
      if (!encryptedField) {
        return null;
      }

      const encryptedData = JSON.parse(encryptedField.value);
      return this.decrypt(encryptedData);
    } catch (error) {
      console.error('❌ Error retrieving temporary key:', error);
      return null;
    }
  }

  private async deleteVaultItem(itemId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.serverUrl}/api/ciphers/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Error deleting vault item:', error);
      return false;
    }
  }

  async cleanupExpiredKeys(): Promise<number> {
    if (!await this.authenticate()) {
      return 0;
    }

    try {
      const response = await fetch(`${this.config.serverUrl}/api/ciphers`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      });

      if (!response.ok) {
        return 0;
      }

      const data = await response.json();
      const tempKeys = data.Data?.filter((item: VaultwardenItem) => 
        item.name.startsWith('Temp Key:')
      ) || [];

      let deletedCount = 0;
      const now = Date.now();

      for (const tempKey of tempKeys) {
        const expiryField = tempKey.fields?.find(field => field.name === 'expires_at');
        if (expiryField && parseInt(expiryField.value) < now) {
          if (await this.deleteVaultItem(tempKey.id)) {
            deletedCount++;
          }
        }
      }

      if (deletedCount > 0) {
        console.log(`🧹 Cleaned up ${deletedCount} expired temporary keys`);
      }

      return deletedCount;
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
      return 0;
    }
  }

  async generateSecureSession(): Promise<string | null> {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionId = crypto.randomBytes(16).toString('hex');
    
    const success = await this.securelyStoreTemporaryKey(
      `session_${sessionId}`,
      sessionToken,
      3600 // 1 hour TTL
    );

    return success ? sessionId : null;
  }

  async validateSecureSession(sessionId: string): Promise<boolean> {
    const sessionToken = await this.retrieveTemporaryKey(`session_${sessionId}`);
    return sessionToken !== null;
  }

  getHealthStatus(): {
    connected: boolean;
    authenticated: boolean;
    tokenExpiry: number;
    serverUrl: string;
  } {
    return {
      connected: Boolean(this.accessToken),
      authenticated: Boolean(this.accessToken && Date.now() < this.tokenExpiry),
      tokenExpiry: this.tokenExpiry,
      serverUrl: this.config.serverUrl
    };
  }
}

// Initialize Vaultwarden security manager
const vaultwardenConfig: VaultwardenConfig = {
  serverUrl: process.env.VAULTWARDEN_SERVER_URL || 'https://vault.example.com',
  clientId: process.env.VAULTWARDEN_CLIENT_ID || '',
  clientSecret: process.env.VAULTWARDEN_CLIENT_SECRET || '',
  organizationId: process.env.VAULTWARDEN_ORG_ID
};

export const vaultwardenSecurity = new VaultwardenSecurityManager(vaultwardenConfig);

// Cleanup job - runs every hour
setInterval(async () => {
  await vaultwardenSecurity.cleanupExpiredKeys();
}, 3600000);

export default vaultwardenSecurity;