import { useState, useEffect } from 'react';
import { Shield, Lock, FileText, AlertCircle, CheckCircle, Eye, Scale, Globe, Database, Key, Users, Settings, Award, TrendingUp, Clock, Zap } from 'lucide-react';

interface ComplianceMetric {
  category: string;
  score: number;
  status: 'compliant' | 'warning' | 'non-compliant';
  lastAudit: string;
  nextReview: string;
}

interface SecurityStandard {
  name: string;
  compliance: number;
  certified: boolean;
  description: string;
  requirements: string[];
}

export default function Compliance() {
  const [selectedSection, setSelectedSection] = useState<'overview' | 'security' | 'privacy' | 'audits'>('overview');
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetric[]>([]);
  const [securityStandards, setSecurityStandards] = useState<SecurityStandard[]>([]);

  useEffect(() => {
    // Initialize compliance metrics
    const metrics: ComplianceMetric[] = [
      {
        category: 'Data Protection',
        score: 98.7,
        status: 'compliant',
        lastAudit: '2024-12-15',
        nextReview: '2025-03-15'
      },
      {
        category: 'Financial Compliance',
        score: 95.2,
        status: 'compliant',
        lastAudit: '2024-12-10',
        nextReview: '2025-01-10'
      },
      {
        category: 'AI Ethics',
        score: 94.8,
        status: 'compliant',
        lastAudit: '2024-12-20',
        nextReview: '2025-02-20'
      },
      {
        category: 'Cybersecurity',
        score: 97.3,
        status: 'compliant',
        lastAudit: '2024-12-18',
        nextReview: '2025-01-18'
      },
      {
        category: 'Operational Risk',
        score: 89.4,
        status: 'warning',
        lastAudit: '2024-12-12',
        nextReview: '2025-01-12'
      },
      {
        category: 'Trading Compliance',
        score: 96.1,
        status: 'compliant',
        lastAudit: '2024-12-22',
        nextReview: '2025-01-22'
      }
    ];
    setComplianceMetrics(metrics);

    // Initialize security standards
    const standards: SecurityStandard[] = [
      {
        name: 'ISO 27001',
        compliance: 98.7,
        certified: true,
        description: 'Information Security Management System',
        requirements: ['Risk assessment', 'Security controls', 'Incident management', 'Continuous monitoring']
      },
      {
        name: 'SOC 2 Type II',
        compliance: 96.4,
        certified: true,
        description: 'Service Organization Control 2',
        requirements: ['Security', 'Availability', 'Processing integrity', 'Confidentiality']
      },
      {
        name: 'GDPR',
        compliance: 99.1,
        certified: true,
        description: 'General Data Protection Regulation',
        requirements: ['Data minimization', 'Consent management', 'Right to erasure', 'Data portability']
      },
      {
        name: 'CCPA',
        compliance: 97.8,
        certified: true,
        description: 'California Consumer Privacy Act',
        requirements: ['Consumer rights', 'Data disclosure', 'Opt-out mechanisms', 'Non-discrimination']
      },
      {
        name: 'PCI DSS',
        compliance: 95.3,
        certified: false,
        description: 'Payment Card Industry Data Security Standard',
        requirements: ['Secure network', 'Cardholder data protection', 'Vulnerability management', 'Access control']
      }
    ];
    setSecurityStandards(standards);
  }, []);

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-400 bg-green-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/20';
      case 'non-compliant': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-400';
    if (score >= 85) return 'text-yellow-400';
    if (score >= 75) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-cyan-950/20 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Compliance & Governance Framework
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Enterprise-grade compliance management with automated monitoring, risk assessment, and regulatory adherence
          </p>
        </div>

        {/* Compliance Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <Shield className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-green-400">97.2%</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Overall Compliance</h3>
            <div className="text-sm text-gray-400">Above industry standard</div>
          </div>

          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold text-cyan-400">5/5</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Certifications</h3>
            <div className="text-sm text-gray-400">Active standards</div>
          </div>

          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-purple-400">24/7</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Monitoring</h3>
            <div className="text-sm text-gray-400">Continuous oversight</div>
          </div>

          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-400">0</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Violations</h3>
            <div className="text-sm text-gray-400">Last 12 months</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-2 flex space-x-2">
            {[
              { id: 'overview', label: 'Overview', icon: Globe },
              { id: 'security', label: 'Security', icon: Lock },
              { id: 'privacy', label: 'Privacy', icon: Eye },
              { id: 'audits', label: 'Audits', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedSection(tab.id as any)}
                  className={`px-6 py-3 rounded-lg transition-all ${
                    selectedSection === tab.id
                      ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 inline-block mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-8">
          {selectedSection === 'overview' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Compliance Overview</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-cyan-400 mb-6">Compliance Metrics</h3>
                  <div className="space-y-4">
                    {complianceMetrics.map((metric, index) => (
                      <div key={index} className="bg-gray-900/50 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-white">{metric.category}</h4>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getComplianceColor(metric.status)}`}>
                            {metric.status === 'compliant' && <CheckCircle className="w-4 h-4 inline-block mr-1" />}
                            {metric.status === 'warning' && <AlertCircle className="w-4 h-4 inline-block mr-1" />}
                            {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-sm">Compliance Score</span>
                            <span className={`font-bold ${getScoreColor(metric.score)}`}>
                              {metric.score.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                metric.score >= 95 ? 'bg-green-400' :
                                metric.score >= 85 ? 'bg-yellow-400' : 'bg-orange-400'
                              }`}
                              style={{ width: `${metric.score}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Last Audit:</span>
                            <div className="text-cyan-400 font-semibold">{metric.lastAudit}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Next Review:</span>
                            <div className="text-purple-400 font-semibold">{metric.nextReview}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-6">Regulatory Framework</h3>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-400/10 to-emerald-500/10 rounded-lg p-6 border border-green-400/20">
                      <h4 className="text-lg font-semibold text-green-400 mb-3">Data Protection Excellence</h4>
                      <p className="text-gray-300 text-sm mb-3">
                        Full GDPR and CCPA compliance with automated data handling, consent management, and privacy-by-design principles.
                      </p>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded">GDPR Compliant</span>
                        <span className="px-2 py-1 bg-blue-400/20 text-blue-400 text-xs rounded">CCPA Certified</span>
                        <span className="px-2 py-1 bg-purple-400/20 text-purple-400 text-xs rounded">Privacy by Design</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-lg p-6 border border-cyan-400/20">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-3">Financial Compliance</h4>
                      <p className="text-gray-300 text-sm mb-3">
                        Adherence to financial regulations including AML, KYC, and trading compliance with real-time monitoring.
                      </p>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-cyan-400/20 text-cyan-400 text-xs rounded">AML Compliant</span>
                        <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded">KYC Verified</span>
                        <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded">Trading Rules</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-lg p-6 border border-purple-400/20">
                      <h4 className="text-lg font-semibold text-purple-400 mb-3">AI Ethics & Governance</h4>
                      <p className="text-gray-300 text-sm mb-3">
                        Responsible AI development with transparency, fairness, and accountability in automated decision-making.
                      </p>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-purple-400/20 text-purple-400 text-xs rounded">Ethical AI</span>
                        <span className="px-2 py-1 bg-pink-400/20 text-pink-400 text-xs rounded">Transparent</span>
                        <span className="px-2 py-1 bg-cyan-400/20 text-cyan-400 text-xs rounded">Accountable</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'security' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Security Standards</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {securityStandards.map((standard, index) => (
                  <div key={index} className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-white text-lg">{standard.name}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        standard.certified ? 'bg-green-400/20 text-green-400' : 'bg-yellow-400/20 text-yellow-400'
                      }`}>
                        {standard.certified ? 'Certified' : 'In Progress'}
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">{standard.description}</p>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">Compliance</span>
                        <span className={`font-bold ${getScoreColor(standard.compliance)}`}>
                          {standard.compliance.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            standard.compliance >= 95 ? 'bg-green-400' :
                            standard.compliance >= 85 ? 'bg-yellow-400' : 'bg-orange-400'
                          }`}
                          style={{ width: `${standard.compliance}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2">Key Requirements</h4>
                      <div className="space-y-1">
                        {standard.requirements.map((requirement, reqIndex) => (
                          <div key={reqIndex} className="flex items-center text-xs">
                            <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                            <span className="text-gray-400">{requirement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gray-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-cyan-400 mb-6">Security Architecture</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Data Encryption',
                      description: 'End-to-end encryption with AES-256',
                      metrics: ['Encryption at rest', 'Encryption in transit', 'Key rotation', 'HSM protection']
                    },
                    {
                      title: 'Access Control',
                      description: 'Multi-factor authentication and RBAC',
                      metrics: ['Zero trust model', 'MFA enforcement', 'Role-based access', 'Session management']
                    },
                    {
                      title: 'Monitoring & Response',
                      description: '24/7 security monitoring and incident response',
                      metrics: ['Real-time monitoring', 'Threat detection', 'Incident response', 'Forensic analysis']
                    }
                  ].map((security, index) => (
                    <div key={index} className="bg-black/30 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-3">{security.title}</h4>
                      <p className="text-gray-400 text-sm mb-4">{security.description}</p>
                      <div className="space-y-2">
                        {security.metrics.map((metric, metricIndex) => (
                          <div key={metricIndex} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-gray-300 text-sm">{metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'privacy' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Privacy Protection</h2>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-6">Privacy Principles</h3>
                    <div className="space-y-4">
                      {[
                        {
                          principle: 'Data Minimization',
                          description: 'Collect only necessary data for specific purposes',
                          implementation: 'Automated data classification and retention policies'
                        },
                        {
                          principle: 'Purpose Limitation',
                          description: 'Use data only for declared purposes',
                          implementation: 'Purpose-bound data processing with audit trails'
                        },
                        {
                          principle: 'Transparency',
                          description: 'Clear communication about data practices',
                          implementation: 'Real-time privacy notices and consent management'
                        },
                        {
                          principle: 'Individual Rights',
                          description: 'Respect user privacy rights and preferences',
                          implementation: 'Automated rights fulfillment and preference centers'
                        }
                      ].map((principle, index) => (
                        <div key={index} className="bg-gray-900/50 rounded-lg p-4">
                          <h4 className="font-semibold text-cyan-400 mb-2">{principle.principle}</h4>
                          <p className="text-gray-300 text-sm mb-2">{principle.description}</p>
                          <p className="text-gray-400 text-xs">{principle.implementation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-green-400 mb-6">Privacy Controls</h3>
                    <div className="bg-gray-900/50 rounded-xl p-6">
                      <div className="space-y-6">
                        {[
                          { control: 'Consent Management', status: 'Active', coverage: '100%' },
                          { control: 'Data Subject Rights', status: 'Automated', coverage: '100%' },
                          { control: 'Privacy Impact Assessments', status: 'Current', coverage: '100%' },
                          { control: 'Data Breach Response', status: 'Ready', coverage: '100%' },
                          { control: 'Cross-border Transfers', status: 'Compliant', coverage: '100%' },
                          { control: 'Vendor Management', status: 'Monitored', coverage: '100%' }
                        ].map((control, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                            <div>
                              <div className="text-white font-medium">{control.control}</div>
                              <div className="text-gray-400 text-sm">{control.status}</div>
                            </div>
                            <div className="text-green-400 font-bold">{control.coverage}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-xl p-6 border border-purple-400/20">
                  <h3 className="text-xl font-semibold text-purple-400 mb-4">Privacy by Design</h3>
                  <p className="text-gray-300 mb-6">
                    Our platform implements privacy by design principles, ensuring privacy protection is built into every aspect of our technology and operations from the ground up.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-400/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-purple-400" />
                      </div>
                      <h4 className="text-white font-semibold mb-2">Secure by Default</h4>
                      <p className="text-gray-400 text-sm">Maximum security settings applied automatically</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-cyan-400/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <Eye className="w-8 h-8 text-cyan-400" />
                      </div>
                      <h4 className="text-white font-semibold mb-2">Transparent</h4>
                      <p className="text-gray-400 text-sm">Clear visibility into data processing activities</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-400/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <Users className="w-8 h-8 text-green-400" />
                      </div>
                      <h4 className="text-white font-semibold mb-2">User-Centric</h4>
                      <p className="text-gray-400 text-sm">Individual privacy rights and preferences respected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'audits' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Audit & Assessment</h2>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-900/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-cyan-400 mb-4">Internal Audits</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frequency</span>
                        <span className="text-white">Monthly</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Audit</span>
                        <span className="text-green-400">Dec 22, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Next Audit</span>
                        <span className="text-purple-400">Jan 22, 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Coverage</span>
                        <span className="text-green-400">100%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-400 mb-4">External Audits</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frequency</span>
                        <span className="text-white">Quarterly</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Audit</span>
                        <span className="text-green-400">Dec 15, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Next Audit</span>
                        <span className="text-purple-400">Mar 15, 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Findings</span>
                        <span className="text-green-400">0 Critical</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-4">Penetration Testing</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frequency</span>
                        <span className="text-white">Bi-annual</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Test</span>
                        <span className="text-green-400">Nov 30, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Next Test</span>
                        <span className="text-purple-400">May 30, 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Vulnerabilities</span>
                        <span className="text-green-400">0 High</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-6">Recent Audit Results</h3>
                  <div className="space-y-4">
                    {[
                      {
                        date: 'Dec 22, 2024',
                        type: 'Internal Security Audit',
                        result: 'Passed',
                        score: '98.7%',
                        findings: 'No critical issues identified'
                      },
                      {
                        date: 'Dec 15, 2024',
                        type: 'SOC 2 Type II Assessment',
                        result: 'Certified',
                        score: '96.4%',
                        findings: 'Minor recommendations implemented'
                      },
                      {
                        date: 'Nov 30, 2024',
                        type: 'Penetration Testing',
                        result: 'Passed',
                        score: '99.1%',
                        findings: 'All vulnerabilities remediated'
                      },
                      {
                        date: 'Nov 15, 2024',
                        type: 'GDPR Compliance Review',
                        result: 'Compliant',
                        score: '99.2%',
                        findings: 'Best practices implemented'
                      }
                    ].map((audit, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <div>
                            <div className="text-white font-medium">{audit.type}</div>
                            <div className="text-gray-400 text-sm">{audit.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-semibold">{audit.result}</div>
                          <div className="text-cyan-400 text-sm">{audit.score}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}