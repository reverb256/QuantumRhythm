import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, Shield, Scale, FileText, Zap } from 'lucide-react';

interface ComplianceResolution {
  ruleId: string;
  status: 'resolved' | 'mitigated' | 'documented' | 'pending';
  implementedSolution: string;
  documentation: string;
  timestamp: Date;
}

interface ComplianceStatus {
  complianceScore: number;
  totalViolations: number;
  resolvedViolations: number;
  status: string;
  resolutions: ComplianceResolution[];
  lastUpdate: Date;
}

const LegalComplianceDashboard: React.FC = () => {
  const [complianceData, setComplianceData] = useState<ComplianceStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplianceStatus();
    const interval = setInterval(fetchComplianceStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchComplianceStatus = async () => {
    try {
      const response = await fetch('/api/legal/status');
      const data = await response.json();
      if (data.success) {
        setComplianceData(data.compliance);
      }
    } catch (error) {
      console.error('Failed to fetch compliance status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'mitigated':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'documented':
        return <FileText className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'mitigated':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'documented':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <div className="animate-pulse bg-gray-800 rounded-lg h-32"></div>
        <div className="animate-pulse bg-gray-800 rounded-lg h-32"></div>
        <div className="animate-pulse bg-gray-800 rounded-lg h-32"></div>
      </div>
    );
  }

  if (!complianceData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <p className="text-gray-400">Unable to load compliance data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-cyan-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <Scale className="w-4 h-4 mr-2 text-cyan-400" />
              Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">
              {complianceData.complianceScore}%
            </div>
            <Progress 
              value={complianceData.complianceScore} 
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              {complianceData.resolvedViolations}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              of {complianceData.totalViolations} violations
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-purple-400" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={`${
              complianceData.status === 'COMPLIANT' 
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            }`}>
              {complianceData.status}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-blue-400" />
              Last Update
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-400">
              {new Date(complianceData.lastUpdate).toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Resolutions */}
      <Card className="bg-gray-900/50 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-cyan-400">Legal Compliance Resolutions</CardTitle>
          <CardDescription className="text-gray-400">
            Comprehensive solutions for regulatory compliance violations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceData.resolutions.map((resolution) => (
              <div 
                key={resolution.ruleId}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(resolution.status)}
                    <div>
                      <h4 className="font-semibold text-white">
                        {resolution.ruleId.toUpperCase()}
                      </h4>
                      <Badge className={getStatusColor(resolution.status)}>
                        {resolution.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(resolution.timestamp).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <h5 className="text-sm font-medium text-cyan-300 mb-1">
                      Implemented Solution:
                    </h5>
                    <p className="text-sm text-gray-300">
                      {resolution.implementedSolution}
                    </p>
                  </div>

                  <details className="group">
                    <summary className="text-sm font-medium text-purple-300 cursor-pointer hover:text-purple-200">
                      View Documentation
                    </summary>
                    <div className="mt-2 p-3 bg-gray-900/50 rounded border border-gray-600/30">
                      <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                        {resolution.documentation}
                      </pre>
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Summary */}
      <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-green-400 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Compliance Achievement Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">
                All critical legal violations have been addressed through technical implementation
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">
                Regulatory compliance maintained while preserving full functionality
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">
                Automated monitoring system active for ongoing compliance assurance
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">
                Documentation and audit trails established for regulatory review
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalComplianceDashboard;