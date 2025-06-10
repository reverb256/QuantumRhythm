import { Connection, PublicKey, ParsedTransactionWithMeta, PartiallyDecodedInstruction } from '@solana/web3.js';
import { LegalComplianceAgent } from './legal-compliance-agent';

interface ForensicTransaction {
  signature: string;
  timestamp: Date;
  type: 'incoming' | 'outgoing' | 'suspicious' | 'drain';
  amount: number;
  token: string;
  fromAddress: string;
  toAddress: string;
  programId: string;
  suspiciousFlags: string[];
  riskScore: number;
  blockTime: number;
  fee: number;
}

interface DrainPattern {
  startTime: Date;
  endTime: Date;
  totalAmount: number;
  transactionCount: number;
  drainType: 'gradual' | 'rapid' | 'systematic';
  attackerAddresses: string[];
  methodUsed: string;
  compromiseVector: string;
}

interface QuantumForensicReport {
  walletAddress: string;
  analysisTimestamp: Date;
  totalTransactions: number;
  suspiciousTransactions: number;
  drainEvents: DrainPattern[];
  attackerProfiles: AttackerProfile[];
  recoveryRecommendations: string[];
  legalActions: string[];
  quantumThreatLevel: 'low' | 'medium' | 'high' | 'critical';
  blockchainEvidence: BlockchainEvidence[];
}

interface AttackerProfile {
  address: string;
  totalStolen: number;
  transactionCount: number;
  activeTimeframe: { start: Date; end: Date };
  knownAssociations: string[];
  methodsUsed: string[];
  riskLevel: number;
}

interface BlockchainEvidence {
  transactionHash: string;
  blockNumber: number;
  timestamp: Date;
  evidenceType: 'drain' | 'suspicious_approval' | 'malicious_contract' | 'phishing';
  details: string;
  preservationStatus: 'preserved' | 'at_risk';
}

export class QuantumForensicAnalyzer {
  private connection: Connection;
  private legalAgent: LegalComplianceAgent;
  private suspiciousProgramIds: Set<string> = new Set();
  private knownScamAddresses: Set<string> = new Set();

  constructor() {
    this.connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');
    this.legalAgent = new LegalComplianceAgent();
    this.initializeKnownThreats();
  }

  private initializeKnownThreats() {
    // Known malicious program IDs and scam addresses
    this.suspiciousProgramIds = new Set([
      // Add known malicious programs
      '11111111111111111111111111111111', // System program (not malicious, but used in drains)
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', // Token program (legitimate but used in attacks)
    ]);

    this.knownScamAddresses = new Set([
      // Known scammer addresses - this would be populated from threat intelligence
    ]);
  }

  async analyzeHackedWallet(): Promise<QuantumForensicReport> {
    const walletAddress = process.env.HACKED_WALLET;
    if (!walletAddress) {
      throw new Error('HACKED_WALLET environment variable not set');
    }

    console.log(`🔍 Starting quantum forensic analysis of wallet: ${walletAddress.slice(0, 8)}...`);

    const publicKey = new PublicKey(walletAddress);
    const transactions = await this.getAllTransactions(publicKey);
    
    console.log(`📊 Found ${transactions.length} transactions to analyze`);

    const forensicTransactions = await this.analyzeTransactions(transactions);
    const drainEvents = this.identifyDrainPatterns(forensicTransactions);
    const attackerProfiles = this.profileAttackers(forensicTransactions);
    const blockchainEvidence = this.preserveEvidence(forensicTransactions);

    const report: QuantumForensicReport = {
      walletAddress,
      analysisTimestamp: new Date(),
      totalTransactions: transactions.length,
      suspiciousTransactions: forensicTransactions.filter(tx => tx.riskScore > 70).length,
      drainEvents,
      attackerProfiles,
      recoveryRecommendations: this.generateRecoveryRecommendations(drainEvents),
      legalActions: await this.generateLegalActions(drainEvents, attackerProfiles),
      quantumThreatLevel: this.assessQuantumThreatLevel(drainEvents),
      blockchainEvidence
    };

    console.log(`🎯 Analysis complete. Found ${drainEvents.length} drain events`);
    return report;
  }

  private async getAllTransactions(publicKey: PublicKey): Promise<ParsedTransactionWithMeta[]> {
    const allTransactions: ParsedTransactionWithMeta[] = [];
    let before: string | undefined;
    const limit = 1000;

    try {
      while (true) {
        const signatures = await this.connection.getSignaturesForAddress(
          publicKey,
          { before, limit }
        );

        if (signatures.length === 0) break;

        console.log(`📥 Fetching ${signatures.length} transaction details...`);

        const transactions = await this.connection.getParsedTransactions(
          signatures.map(sig => sig.signature),
          { maxSupportedTransactionVersion: 0 }
        );

        const validTransactions = transactions.filter(tx => tx !== null) as ParsedTransactionWithMeta[];
        allTransactions.push(...validTransactions);

        before = signatures[signatures.length - 1].signature;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }

    return allTransactions.sort((a, b) => (a.blockTime || 0) - (b.blockTime || 0));
  }

  private async analyzeTransactions(transactions: ParsedTransactionWithMeta[]): Promise<ForensicTransaction[]> {
    const forensicTransactions: ForensicTransaction[] = [];

    for (const tx of transactions) {
      if (!tx.blockTime) continue;

      const forensicTx = await this.analyzeTransaction(tx);
      forensicTransactions.push(forensicTx);
    }

    return forensicTransactions;
  }

  private async analyzeTransaction(tx: ParsedTransactionWithMeta): Promise<ForensicTransaction> {
    const signature = tx.transaction.signatures[0];
    const timestamp = new Date((tx.blockTime || 0) * 1000);
    const walletAddress = process.env.HACKED_WALLET!;

    let type: 'incoming' | 'outgoing' | 'suspicious' | 'drain' = 'outgoing';
    let amount = 0;
    let token = 'SOL';
    let fromAddress = '';
    let toAddress = '';
    let programId = '';
    const suspiciousFlags: string[] = [];
    let riskScore = 0;

    // Analyze pre and post balances
    const preBalance = tx.meta?.preBalances?.[0] || 0;
    const postBalance = tx.meta?.postBalances?.[0] || 0;
    const balanceChange = (postBalance - preBalance) / 1e9; // Convert lamports to SOL

    amount = Math.abs(balanceChange);

    if (balanceChange > 0) {
      type = 'incoming';
    } else if (balanceChange < 0) {
      type = 'outgoing';
    }

    // Analyze instructions for suspicious patterns
    for (const instruction of tx.transaction.message.instructions) {
      if ('programId' in instruction) {
        programId = instruction.programId.toString();
        
        // Check for suspicious program interactions
        if (this.suspiciousProgramIds.has(programId)) {
          suspiciousFlags.push('suspicious_program');
          riskScore += 30;
        }
      }
    }

    // Analyze account keys for known scam addresses
    for (const accountKey of tx.transaction.message.accountKeys) {
      const address = accountKey.pubkey.toString();
      if (this.knownScamAddresses.has(address)) {
        suspiciousFlags.push('known_scammer');
        riskScore += 50;
      }
    }

    // Detect drain patterns
    if (amount > 0.1 && type === 'outgoing') {
      suspiciousFlags.push('large_outgoing');
      riskScore += 20;
    }

    // Check for rapid succession of transactions
    if (tx.meta?.err === null && amount > 0.01) {
      suspiciousFlags.push('successful_transfer');
      riskScore += 10;
    }

    // Mark as drain if high risk score
    if (riskScore > 60) {
      type = 'drain';
    } else if (riskScore > 30) {
      type = 'suspicious';
    }

    return {
      signature,
      timestamp,
      type,
      amount,
      token,
      fromAddress: walletAddress,
      toAddress: toAddress || 'unknown',
      programId,
      suspiciousFlags,
      riskScore,
      blockTime: tx.blockTime || 0,
      fee: (tx.meta?.fee || 0) / 1e9
    };
  }

  private identifyDrainPatterns(transactions: ForensicTransaction[]): DrainPattern[] {
    const drainEvents: DrainPattern[] = [];
    const drainTxs = transactions.filter(tx => tx.type === 'drain' || tx.type === 'suspicious');

    if (drainTxs.length === 0) return drainEvents;

    // Group transactions by time windows to identify drain events
    const timeWindows = this.groupTransactionsByTimeWindow(drainTxs, 3600); // 1 hour windows

    for (const window of timeWindows) {
      if (window.length < 2) continue;

      const startTime = new Date(Math.min(...window.map(tx => tx.timestamp.getTime())));
      const endTime = new Date(Math.max(...window.map(tx => tx.timestamp.getTime())));
      const totalAmount = window.reduce((sum, tx) => sum + tx.amount, 0);
      const attackerAddresses = [...new Set(window.map(tx => tx.toAddress))];

      const duration = (endTime.getTime() - startTime.getTime()) / 1000; // seconds
      let drainType: 'gradual' | 'rapid' | 'systematic' = 'systematic';

      if (duration < 300) { // 5 minutes
        drainType = 'rapid';
      } else if (duration > 3600) { // 1 hour
        drainType = 'gradual';
      }

      drainEvents.push({
        startTime,
        endTime,
        totalAmount,
        transactionCount: window.length,
        drainType,
        attackerAddresses,
        methodUsed: this.identifyAttackMethod(window),
        compromiseVector: this.identifyCompromiseVector(window)
      });
    }

    return drainEvents;
  }

  private groupTransactionsByTimeWindow(transactions: ForensicTransaction[], windowSeconds: number): ForensicTransaction[][] {
    const windows: ForensicTransaction[][] = [];
    let currentWindow: ForensicTransaction[] = [];
    let windowStart: number | null = null;

    for (const tx of transactions.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())) {
      const txTime = tx.timestamp.getTime();

      if (windowStart === null) {
        windowStart = txTime;
        currentWindow = [tx];
      } else if (txTime - windowStart <= windowSeconds * 1000) {
        currentWindow.push(tx);
      } else {
        if (currentWindow.length > 0) {
          windows.push(currentWindow);
        }
        windowStart = txTime;
        currentWindow = [tx];
      }
    }

    if (currentWindow.length > 0) {
      windows.push(currentWindow);
    }

    return windows;
  }

  private identifyAttackMethod(transactions: ForensicTransaction[]): string {
    const flags = transactions.flatMap(tx => tx.suspiciousFlags);
    
    if (flags.includes('suspicious_program')) {
      return 'Malicious Program Interaction';
    }
    if (flags.includes('known_scammer')) {
      return 'Known Scammer Address';
    }
    if (flags.some(f => f.includes('approval'))) {
      return 'Token Approval Exploit';
    }
    
    return 'Direct Transfer Drain';
  }

  private identifyCompromiseVector(transactions: ForensicTransaction[]): string {
    const programIds = [...new Set(transactions.map(tx => tx.programId))];
    
    if (programIds.some(id => id.includes('Serum') || id.includes('Raydium'))) {
      return 'DEX Interaction Compromise';
    }
    if (programIds.some(id => id.includes('Token'))) {
      return 'Token Program Exploit';
    }
    
    return 'Private Key Compromise';
  }

  private profileAttackers(transactions: ForensicTransaction[]): AttackerProfile[] {
    const attackerMap = new Map<string, ForensicTransaction[]>();

    // Group transactions by attacker address
    for (const tx of transactions.filter(tx => tx.type === 'drain' || tx.type === 'suspicious')) {
      if (!attackerMap.has(tx.toAddress)) {
        attackerMap.set(tx.toAddress, []);
      }
      attackerMap.get(tx.toAddress)!.push(tx);
    }

    const profiles: AttackerProfile[] = [];

    for (const [address, txs] of attackerMap.entries()) {
      if (txs.length === 0) continue;

      const totalStolen = txs.reduce((sum, tx) => sum + tx.amount, 0);
      const timestamps = txs.map(tx => tx.timestamp);
      const start = new Date(Math.min(...timestamps.map(t => t.getTime())));
      const end = new Date(Math.max(...timestamps.map(t => t.getTime())));
      
      const methodsUsed = [...new Set(txs.flatMap(tx => tx.suspiciousFlags))];
      const riskLevel = Math.max(...txs.map(tx => tx.riskScore));

      profiles.push({
        address,
        totalStolen,
        transactionCount: txs.length,
        activeTimeframe: { start, end },
        knownAssociations: [], // Would be populated from threat intelligence
        methodsUsed,
        riskLevel
      });
    }

    return profiles.sort((a, b) => b.totalStolen - a.totalStolen);
  }

  private preserveEvidence(transactions: ForensicTransaction[]): BlockchainEvidence[] {
    const evidence: BlockchainEvidence[] = [];

    for (const tx of transactions.filter(tx => tx.riskScore > 50)) {
      evidence.push({
        transactionHash: tx.signature,
        blockNumber: tx.blockTime,
        timestamp: tx.timestamp,
        evidenceType: tx.type === 'drain' ? 'drain' : 'suspicious_approval',
        details: `${tx.type.toUpperCase()}: ${tx.amount} ${tx.token} to ${tx.toAddress.slice(0, 8)}... | Flags: ${tx.suspiciousFlags.join(', ')}`,
        preservationStatus: 'preserved'
      });
    }

    return evidence;
  }

  private generateRecoveryRecommendations(drainEvents: DrainPattern[]): string[] {
    const recommendations: string[] = [
      'Immediately rotate all private keys and seed phrases',
      'Review and revoke all token approvals on connected wallets',
      'Implement hardware wallet security for future transactions',
      'Enable multi-signature wallet protection',
      'Conduct security audit of all connected applications'
    ];

    if (drainEvents.some(event => event.drainType === 'rapid')) {
      recommendations.push('Implement transaction monitoring and alerts for rapid spending');
    }

    if (drainEvents.some(event => event.methodUsed.includes('Program'))) {
      recommendations.push('Avoid interacting with unverified programs and contracts');
    }

    return recommendations;
  }

  private async generateLegalActions(drainEvents: DrainPattern[], attackerProfiles: AttackerProfile[]): Promise<string[]> {
    const actions: string[] = [];

    const totalLoss = drainEvents.reduce((sum, event) => sum + event.totalAmount, 0);

    if (totalLoss > 1000) { // Significant loss threshold
      actions.push('File report with local law enforcement cyber crime unit');
      actions.push('Report to FBI Internet Crime Complaint Center (IC3)');
    }

    if (totalLoss > 10000) {
      actions.push('Consult with cryptocurrency litigation attorney');
      actions.push('Consider civil recovery proceedings');
    }

    if (attackerProfiles.some(profile => profile.transactionCount > 10)) {
      actions.push('Submit evidence to blockchain analysis firms');
      actions.push('Coordinate with exchange compliance teams for freeze orders');
    }

    // Canadian specific actions
    actions.push('Report to Canadian Anti-Fraud Centre (CAFC)');
    actions.push('File complaint with provincial securities regulator');

    return actions;
  }

  private assessQuantumThreatLevel(drainEvents: DrainPattern[]): 'low' | 'medium' | 'high' | 'critical' {
    const totalLoss = drainEvents.reduce((sum, event) => sum + event.totalAmount, 0);
    const rapidDrains = drainEvents.filter(event => event.drainType === 'rapid').length;

    if (totalLoss > 10000 || rapidDrains > 2) {
      return 'critical';
    } else if (totalLoss > 1000 || rapidDrains > 0) {
      return 'high';
    } else if (totalLoss > 100) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  async generateForensicReport(): Promise<QuantumForensicReport> {
    console.log('🔍 QUANTUM FORENSIC ANALYSIS INITIATED');
    console.log('=====================================');
    
    const report = await this.analyzeHackedWallet();
    
    console.log(`📊 ANALYSIS COMPLETE`);
    console.log(`🎯 Wallet: ${report.walletAddress.slice(0, 8)}...`);
    console.log(`📈 Total Transactions: ${report.totalTransactions}`);
    console.log(`⚠️  Suspicious Transactions: ${report.suspiciousTransactions}`);
    console.log(`💥 Drain Events: ${report.drainEvents.length}`);
    console.log(`🎭 Attacker Profiles: ${report.attackerProfiles.length}`);
    console.log(`🚨 Threat Level: ${report.quantumThreatLevel.toUpperCase()}`);
    
    if (report.drainEvents.length > 0) {
      console.log(`\n💰 LARGEST DRAIN EVENT:`);
      const largestDrain = report.drainEvents.reduce((max, event) => 
        event.totalAmount > max.totalAmount ? event : max
      );
      console.log(`   Amount: ${largestDrain.totalAmount.toFixed(4)} SOL`);
      console.log(`   Date: ${largestDrain.startTime.toLocaleDateString()}`);
      console.log(`   Type: ${largestDrain.drainType}`);
      console.log(`   Method: ${largestDrain.methodUsed}`);
    }
    
    return report;
  }
}