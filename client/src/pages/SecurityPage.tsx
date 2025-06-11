import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Key, Server, Database, FileShield } from 'lucide-react';
import SecureAIDashboard from '@/components/SecureAIDashboard';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Full Spectrum Security
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Enterprise-grade security infrastructure with Vaultwarden integration for encrypted AI communications, 
            comprehensive audit logging, and zero-trust authentication protocols.
          </p>
        </div>

        {/* Security Features Overview */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Lock className="h-5 w-5" />
                Vaultwarden Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <ul className="space-y-2 text-sm">
                <li>• Secure credential storage</li>
                <li>• End-to-end encryption</li>
                <li>• Session management</li>
                <li>• Automatic key rotation</li>
                <li>• Bitwarden compatibility</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Key className="h-5 w-5" />
                AI Communications
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <ul className="space-y-2 text-sm">
                <li>• Encrypted AI requests</li>
                <li>• Model-agnostic routing</li>
                <li>• Rate limiting protection</li>
                <li>• Response encryption</li>
                <li>• Audit trail logging</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <FileShield className="h-5 w-5" />
                Security Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <ul className="space-y-2 text-sm">
                <li>• Real-time threat detection</li>
                <li>• Comprehensive audit logs</li>
                <li>• Session monitoring</li>
                <li>• Security metrics</li>
                <li>• Compliance reporting</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Security Architecture */}
        <Card className="bg-gray-800/50 border-gray-700 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-400">
              <Server className="h-5 w-5" />
              Security Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-white">Encryption Layer</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Transport Security</span>
                    <Badge variant="default" className="bg-green-600">TLS 1.3</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Data Encryption</span>
                    <Badge variant="default" className="bg-green-600">AES-256-CBC</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Key Derivation</span>
                    <Badge variant="default" className="bg-green-600">PBKDF2</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Session Security</span>
                    <Badge variant="default" className="bg-green-600">JWT + Rotation</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-white">Access Control</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Authentication</span>
                    <Badge variant="default" className="bg-blue-600">Multi-Factor</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Authorization</span>
                    <Badge variant="default" className="bg-blue-600">Role-Based</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Rate Limiting</span>
                    <Badge variant="default" className="bg-blue-600">Adaptive</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Audit Logging</span>
                    <Badge variant="default" className="bg-blue-600">Complete</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance & Standards */}
        <Card className="bg-gray-800/50 border-gray-700 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Database className="h-5 w-5" />
              Compliance & Standards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <Badge variant="outline" className="mb-2 border-green-500 text-green-400">
                  SOC 2 Type II
                </Badge>
                <p className="text-xs text-gray-400">Security Controls</p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2 border-blue-500 text-blue-400">
                  ISO 27001
                </Badge>
                <p className="text-xs text-gray-400">Information Security</p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2 border-purple-500 text-purple-400">
                  GDPR Ready
                </Badge>
                <p className="text-xs text-gray-400">Data Protection</p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2 border-orange-500 text-orange-400">
                  Zero Trust
                </Badge>
                <p className="text-xs text-gray-400">Network Security</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Security Dashboard */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Live Security Dashboard
          </h2>
          <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <SecureAIDashboard />
          </div>
        </div>

        {/* Security Best Practices */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-yellow-400">Security Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2 text-white">For Developers</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Always use encrypted channels for AI communications</li>
                  <li>• Implement proper session management</li>
                  <li>• Monitor audit logs regularly</li>
                  <li>• Use strong authentication mechanisms</li>
                  <li>• Keep dependencies updated</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-white">For Operations</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Regular security assessments</li>
                  <li>• Incident response procedures</li>
                  <li>• Backup and recovery plans</li>
                  <li>• Network segmentation</li>
                  <li>• Continuous monitoring</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}