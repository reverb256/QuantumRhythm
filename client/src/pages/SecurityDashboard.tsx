import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Shield, AlertTriangle, CheckCircle, XCircle, FileText, Download, Scan } from 'lucide-react';

interface SecurityVulnerability {
  type: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  file: string;
  line?: number;
  description: string;
  recommendation: string;
  cve?: string;
}

interface SecurityAuditReport {
  summary: {
    totalFiles: number;
    vulnerabilities: number;
    criticalIssues: number;
    highRiskIssues: number;
    overallScore: number;
  };
  vulnerabilities: SecurityVulnerability[];
  recommendations: string[];
  complianceStatus: {
    gdpr: boolean;
    sox: boolean;
    pci: boolean;
    iso27001: boolean;
  };
}

export default function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVulnerability, setSelectedVulnerability] = useState<SecurityVulnerability | null>(null);

  // Fetch security audit data
  const { data: auditData, isLoading, refetch } = useQuery({
    queryKey: ['/api/security/audit'],
    refetchInterval: 300000 // 5 minutes
  });

  const { data: reportData } = useQuery({
    queryKey: ['/api/security/report'],
    enabled: !!auditData
  });

  const audit: SecurityAuditReport | null = auditData?.audit || null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getVulnerabilityColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const downloadReport = () => {
    if (reportData?.report) {
      const blob = new Blob([reportData.report], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'security-audit-report.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-t-2 border-cyan-400 rounded-full"
        />
        <span className="ml-4 text-cyan-400">Running security audit...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-cyan-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>
                <p className="text-gray-400">Comprehensive security audit and monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => refetch()}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <Scan className="w-4 h-4" />
                <span>Run Audit</span>
              </button>
              <button
                onClick={downloadReport}
                disabled={!reportData?.report}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Score Overview */}
      {audit && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Security Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(audit.summary.overallScore)}`}>
                    {audit.summary.overallScore}/100
                  </p>
                </div>
                <Shield className={`w-12 h-12 ${getScoreColor(audit.summary.overallScore)}`} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-xl p-6 border border-red-700/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Critical Issues</p>
                  <p className="text-3xl font-bold text-red-400">{audit.summary.criticalIssues}</p>
                </div>
                <XCircle className="w-12 h-12 text-red-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 rounded-xl p-6 border border-orange-700/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">High Risk</p>
                  <p className="text-3xl font-bold text-orange-400">{audit.summary.highRiskIssues}</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-orange-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Issues</p>
                  <p className="text-3xl font-bold text-cyan-400">{audit.summary.vulnerabilities}</p>
                </div>
                <FileText className="w-12 h-12 text-cyan-400" />
              </div>
            </motion.div>
          </div>

          {/* Compliance Status */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Compliance Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(audit.complianceStatus).map(([standard, compliant]) => (
                <div key={standard} className="flex items-center space-x-3">
                  {compliant ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                  <span className="text-white font-medium">{standard.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
            {['overview', 'vulnerabilities', 'recommendations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md transition-colors capitalize ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content based on active tab */}
          {activeTab === 'vulnerabilities' && (
            <div className="space-y-4">
              {audit.vulnerabilities.map((vuln, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${getVulnerabilityColor(vuln.type)}`}
                  onClick={() => setSelectedVulnerability(vuln)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getVulnerabilityColor(vuln.type)}`}>
                          {vuln.type}
                        </span>
                        <span className="text-sm text-gray-400">{vuln.category}</span>
                        {vuln.cve && (
                          <span className="text-xs bg-gray-700 px-2 py-1 rounded">{vuln.cve}</span>
                        )}
                      </div>
                      <h4 className="font-semibold text-white mb-1">{vuln.description}</h4>
                      <p className="text-sm text-gray-400">{vuln.file}:{vuln.line || 'N/A'}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              {audit.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-lg border border-blue-700/30"
                >
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-white">{rec}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Vulnerability Distribution</h3>
                <div className="space-y-3">
                  {['critical', 'high', 'medium', 'low'].map((type) => {
                    const count = audit.vulnerabilities.filter(v => v.type === type).length;
                    const percentage = audit.summary.vulnerabilities > 0 ? (count / audit.summary.vulnerabilities) * 100 : 0;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="capitalize text-white">{type}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                type === 'critical' ? 'bg-red-400' :
                                type === 'high' ? 'bg-orange-400' :
                                type === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-gray-400 w-8 text-right">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Security Categories</h3>
                <div className="space-y-3">
                  {Object.entries(
                    audit.vulnerabilities.reduce((acc, vuln) => {
                      acc[vuln.category] = (acc[vuln.category] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="capitalize text-white">{category}</span>
                      <span className="text-cyan-400 font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vulnerability Detail Modal */}
      {selectedVulnerability && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Vulnerability Details</h3>
              <button
                onClick={() => setSelectedVulnerability(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded text-sm font-bold uppercase ${getVulnerabilityColor(selectedVulnerability.type)}`}>
                  {selectedVulnerability.type}
                </span>
                <span className="text-gray-400">{selectedVulnerability.category}</span>
                {selectedVulnerability.cve && (
                  <span className="bg-gray-700 px-2 py-1 rounded text-sm">{selectedVulnerability.cve}</span>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Description</h4>
                <p className="text-gray-300">{selectedVulnerability.description}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Location</h4>
                <p className="text-gray-300 font-mono">{selectedVulnerability.file}:{selectedVulnerability.line || 'N/A'}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Recommendation</h4>
                <p className="text-gray-300">{selectedVulnerability.recommendation}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}