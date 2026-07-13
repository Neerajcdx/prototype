import { UserSession, Honeytoken, Alert, Activity, VaultCredential, AccessPolicy } from '../types';

export const INITIAL_USERS: UserSession[] = [
  {
    username: 'admin_raj',
    role: 'Principal Database Administrator',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    currentRiskScore: 12,
    status: 'ACTIVE',
    ipAddress: '10.240.12.89',
    location: 'Mumbai, India (Headquarters)',
    lastActive: 'Just now',
    riskFactors: [
      { factor: 'Accessed Production DB', score: 8 },
      { factor: 'Standard Admin Session Time', score: 4 }
    ],
    credentialId: 'cred_db_raj',
    homeBase: 'Mumbai, India (Headquarters)',
    homeBaseCoords: { lat: 19.0760, lng: 72.8777 },
    currentCoords: { lat: 19.0760, lng: 72.8777 }
  },
  {
    username: 'vendor_acct_09',
    role: 'Third-Party Support API (FinTech Integrator)',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    currentRiskScore: 38,
    status: 'ACTIVE',
    ipAddress: '198.51.100.22',
    location: 'Chicago, USA (Vendor Cloud VPC)',
    lastActive: '5 mins ago',
    riskFactors: [
      { factor: 'Off-hours API Query (2:15 AM Mumbai)', score: 20 },
      { factor: 'Unusual Volume of Record Pulls (+1,200)', score: 18 }
    ],
    credentialId: 'cred_api_vendor',
    homeBase: 'Chicago, USA (Vendor Cloud VPC)',
    homeBaseCoords: { lat: 41.8781, lng: -87.6298 },
    currentCoords: { lat: 41.8781, lng: -87.6298 }
  },
  {
    username: 'dev_leo',
    role: 'Senior Platform Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    currentRiskScore: 8,
    status: 'ACTIVE',
    ipAddress: '10.240.15.110',
    location: 'Pune, India (Internal Dev-Net)',
    lastActive: '12 mins ago',
    riskFactors: [
      { factor: 'Standard Git Push to Staging', score: 5 },
      { factor: 'IP Whitelisted Range', score: 3 }
    ],
    credentialId: 'cred_ssh_leo',
    homeBase: 'Pune, India (Internal Dev-Net)',
    homeBaseCoords: { lat: 18.5204, lng: 73.8567 },
    currentCoords: { lat: 18.5204, lng: 73.8567 }
  },
  {
    username: 'sec_audit_clara',
    role: 'Lead Security compliance Auditor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    currentRiskScore: 5,
    status: 'ACTIVE',
    ipAddress: '10.240.4.12',
    location: 'Mumbai, India (Headquarters)',
    lastActive: '1 hour ago',
    riskFactors: [
      { factor: 'Read-only compliance audit tables', score: 5 }
    ],
    credentialId: 'cred_audit_clara',
    homeBase: 'Mumbai, India (Headquarters)',
    homeBaseCoords: { lat: 19.0760, lng: 72.8777 },
    currentCoords: { lat: 19.0760, lng: 72.8777 }
  },
  {
    username: 'contractor_sam',
    role: 'External QA Analyst (Temporary)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    currentRiskScore: 45,
    status: 'MFA_REQUIRED',
    ipAddress: '203.0.113.84',
    location: 'Bangalore, India (Residential IP)',
    lastActive: '34 mins ago',
    riskFactors: [
      { factor: 'Multiple Login Failures (+3)', score: 25 },
      { factor: 'New Unregistered Device', score: 20 }
    ],
    credentialId: 'cred_contractor_sam',
    homeBase: 'Bangalore, India (Residential IP)',
    homeBaseCoords: { lat: 12.9716, lng: 77.5946 },
    currentCoords: { lat: 12.9716, lng: 77.5946 }
  }
];

export const INITIAL_HONEYTOKENS: Honeytoken[] = [
  {
    id: 'ht_swift',
    name: 'SWIFT_TRANSFER_BYPASS_KEY',
    type: 'CONFIG_FILE',
    description: 'Decoy file structured like a SWIFT money transfer backup private key, embedded in standard cloud directory Share.',
    location: '/mnt/finance-share/backups/swift_master_private.pem',
    status: 'UNTOUCHED',
    triggeredBy: null,
    triggeredAt: null
  },
  {
    id: 'ht_customer_db',
    name: 'HNW_CUSTOMERS_UNENCRYPTED_MOCK',
    type: 'DATABASE_TABLE',
    description: 'Decoy table inside the core database purporting to contain unencrypted routing numbers and balances of High-Net-Worth VIP clients.',
    location: 'SQL_SERVER_DB.public.vip_balances_unencrypted',
    status: 'UNTOUCHED',
    triggeredBy: null,
    triggeredAt: null
  },
  {
    id: 'ht_admin_portal',
    name: 'SENTINEL_ROOT_BYPASS_CONSOLE',
    type: 'ADMIN_PORTAL',
    description: 'A fake hidden admin login console running on an unmapped internal port, rigged with credential harvesters.',
    location: 'https://internal-portal.bank.com:9443/emergency_bypass',
    status: 'UNTOUCHED',
    triggeredBy: null,
    triggeredAt: null
  },
  {
    id: 'ht_git_aws',
    name: 'AWS_PROD_DOCKER_MOCK_SECRET',
    type: 'CREDENTIAL',
    description: 'Decoy AWS secret keys placed in a commented config block in a public-facing GitLab deployment repository.',
    location: 'gitlab.bank.com/infra/deployment-manifests/-/blob/main/values.yaml#L45',
    status: 'UNTOUCHED',
    triggeredBy: null,
    triggeredAt: null
  }
];

export const INITIAL_CREDENTIALS: VaultCredential[] = [
  {
    id: 'cred_db_raj',
    name: 'Production DB Master Password',
    owner: 'admin_raj',
    type: 'ROOT_PASSWORD',
    cipherType: 'RSA-4096 (Vulnerable)',
    originalValue: 'db_admin_super_secret_pass_2026!',
    encryptedValue: 'RSA4096_ENC[8d2a1b9c9f8e7d6c5b4a3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9...]',
    lastRotated: '2026-07-12 08:00 AM',
    rotationCount: 4,
    isQuantumProof: false
  },
  {
    id: 'cred_api_vendor',
    name: 'FinTech Integrator Core API Token',
    owner: 'vendor_acct_09',
    type: 'API_KEY',
    cipherType: 'RSA-4096 (Vulnerable)',
    originalValue: 'fintech_api_token_live_e938cd73ab2140df98',
    encryptedValue: 'RSA4096_ENC[e2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7...]',
    lastRotated: '2026-07-01 12:00 AM',
    rotationCount: 1,
    isQuantumProof: false
  },
  {
    id: 'cred_ssh_leo',
    name: 'Staging API Gateway Private SSH Key',
    owner: 'dev_leo',
    type: 'SSH_KEY',
    cipherType: 'RSA-4096 (Vulnerable)',
    originalValue: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDC8gS3x...',
    encryptedValue: 'RSA4096_ENC[0e9d8c7b6a5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5...]',
    lastRotated: '2026-06-15 03:30 PM',
    rotationCount: 2,
    isQuantumProof: false
  },
  {
    id: 'cred_audit_clara',
    name: 'compliance Vault DB Connection String',
    owner: 'sec_audit_clara',
    type: 'DB_CONN_STRING',
    cipherType: 'RSA-4096 (Vulnerable)',
    originalValue: 'postgresql://audit_clara:auditPassword123@audit-rds.bank.internal:5432/audit_db',
    encryptedValue: 'RSA4096_ENC[b7a6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6...]',
    lastRotated: '2026-05-10 10:15 AM',
    rotationCount: 1,
    isQuantumProof: false
  },
  {
    id: 'cred_contractor_sam',
    name: 'QA Sandbox API Gateway Key',
    owner: 'contractor_sam',
    type: 'API_KEY',
    cipherType: 'RSA-4096 (Vulnerable)',
    originalValue: 'qa_sandbox_apikey_992100dd882bc',
    encryptedValue: 'RSA4096_ENC[6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5...]',
    lastRotated: '2026-07-10 02:45 PM',
    rotationCount: 1,
    isQuantumProof: false
  }
];

export const ACCESS_POLICIES: AccessPolicy[] = [
  {
    riskTier: 'LOW',
    scoreRange: '0 - 29',
    mfaEnforced: false,
    accessRestricted: false,
    autoRekeyTriggered: false,
    sessionTermination: false,
    description: 'Standard operational permissions. Normal access to assigned resources, read/write within whitelisted scopes.'
  },
  {
    riskTier: 'MEDIUM',
    scoreRange: '30 - 59',
    mfaEnforced: true,
    accessRestricted: false,
    autoRekeyTriggered: false,
    sessionTermination: false,
    description: 'Elevated anomaly suspicion. Force Step-Up MFA for any write/export actions. Alert pushed to SOC active log.'
  },
  {
    riskTier: 'HIGH',
    scoreRange: '60 - 79',
    mfaEnforced: true,
    accessRestricted: true,
    autoRekeyTriggered: true,
    sessionTermination: false,
    description: 'Severely anomalous activity. Read-only lockout on primary databases. Triggers proactive post-quantum re-keying on associated secrets.'
  },
  {
    riskTier: 'CRITICAL',
    scoreRange: '80 - 100',
    mfaEnforced: true,
    accessRestricted: true,
    autoRekeyTriggered: true,
    sessionTermination: true,
    description: 'CONFIRMED insider threat / Honeytoken trigger. Immediate session cancellation, domain accounts locked, Kyber quantum-proof auto-rekeying executed instantly across all credentials.'
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alert_001',
    severity: 'MEDIUM',
    type: 'SUSPECTED',
    title: 'Anomalous Database Query Volume',
    description: 'vendor_acct_09 extracted 1,200 customer profiles during off-hours, deviating from historical baseline of <100 records in this window.',
    username: 'vendor_acct_09',
    timestamp: '02:15:22 AM',
    status: 'INVESTIGATING',
    honeytokenName: null,
    rekeyTriggered: false,
    rekeyDurationMs: null,
    timeline: [
      { time: '02:14:05 AM', message: 'API session initiated from chicago_node_9', phase: 'DETECT' },
      { time: '02:14:32 AM', message: 'Read query on Customer_Master table initiated', phase: 'ANALYZE' },
      { time: '02:15:22 AM', message: 'Data export size exceeded safe limit (1,200 records)', phase: 'ANALYZE' }
    ]
  },
  {
    id: 'alert_002',
    severity: 'LOW',
    type: 'SUSPECTED',
    title: 'Multi-device Session Discrepancy',
    description: 'contractor_sam logged in from residential IP while previous session from corporate VPN was still active.',
    username: 'contractor_sam',
    timestamp: '12:31:04 AM',
    status: 'OPEN',
    honeytokenName: null,
    rekeyTriggered: false,
    rekeyDurationMs: null,
    timeline: [
      { time: '12:20:00 AM', message: 'Session active from Corp VPN IP 10.12.80.45', phase: 'DETECT' },
      { time: '12:31:04 AM', message: 'Parallel session requested from residential IP 203.0.113.84', phase: 'ANALYZE' },
      { time: '12:31:10 AM', message: 'Step-up MFA challenged; no response received yet', phase: 'ANALYZE' }
    ]
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act_001',
    username: 'admin_raj',
    role: 'Principal Database Administrator',
    timestamp: '02:30:15 AM',
    resource: 'prod_database_schema_v2',
    action: 'VACUUM ANALYZE',
    volume: 0,
    ipAddress: '10.240.12.89',
    location: 'Mumbai, India (Headquarters)',
    riskContribution: 3,
    isAnomaly: false,
    anomalyReason: '',
    honeytokenTriggered: null,
    coords: { lat: 19.0760, lng: 72.8777 },
    distanceKm: 0
  },
  {
    id: 'act_002',
    username: 'dev_leo',
    role: 'Senior Platform Engineer',
    timestamp: '02:28:44 AM',
    resource: 'gitlab.bank.com/infra/deployment',
    action: 'GIT_PUSH',
    volume: 12, // MB
    ipAddress: '10.240.15.110',
    location: 'Pune, India (Internal Dev-Net)',
    riskContribution: 4,
    isAnomaly: false,
    anomalyReason: '',
    honeytokenTriggered: null,
    coords: { lat: 18.5204, lng: 73.8567 },
    distanceKm: 0
  },
  {
    id: 'act_003',
    username: 'vendor_acct_09',
    role: 'Third-Party Support API',
    timestamp: '02:15:22 AM',
    resource: 'SQL_SERVER_DB.public.customers',
    action: 'EXPORT',
    volume: 1200, // records
    ipAddress: '198.51.100.22',
    location: 'Chicago, USA (Vendor Cloud VPC)',
    riskContribution: 38,
    isAnomaly: true,
    anomalyReason: 'Unusually high transaction records query count in off-hours',
    honeytokenTriggered: null,
    coords: { lat: 41.8781, lng: -87.6298 },
    distanceKm: 0
  },
  {
    id: 'act_004',
    username: 'sec_audit_clara',
    role: 'Lead Security compliance Auditor',
    timestamp: '02:02:11 AM',
    resource: 'audit_log_store_july',
    action: 'READ',
    volume: 14, // records
    ipAddress: '10.240.4.12',
    location: 'Mumbai, India (Headquarters)',
    riskContribution: 2,
    isAnomaly: false,
    anomalyReason: '',
    honeytokenTriggered: null,
    coords: { lat: 19.0760, lng: 72.8777 },
    distanceKm: 0
  },
  {
    id: 'act_005',
    username: 'contractor_sam',
    role: 'External QA Analyst (Temporary)',
    timestamp: '01:54:30 AM',
    resource: 'api_sandbox_v1',
    action: 'AUTH_ATTEMPT',
    volume: 1,
    ipAddress: '203.0.113.84',
    location: 'Bangalore, India (Residential IP)',
    riskContribution: 15,
    isAnomaly: true,
    anomalyReason: 'Multiple incorrect authentication entries from temporary location',
    honeytokenTriggered: null,
    coords: { lat: 12.9716, lng: 77.5946 },
    distanceKm: 0
  }
];

// Helper to generate realistic high-entropy post-quantum key strings
export function generatePostQuantumCipher(plainText: string): string {
  // Post-quantum ML-KEM/Kyber uses polynomials with modular coefficients
  // We'll generate a beautiful and educational hex-coefficient grid that represents polynomial vectors
  const baseHex = "0123456789abcdef";
  let polynomialCoefficients = [];
  
  // Create 3 rows of vector components
  for (let r = 0; r < 3; r++) {
    let row = [];
    for (let c = 0; c < 8; c++) {
      // Simulate typical Kyber ring coefficients in Z_3329 (e.g. range -1664 to 1664)
      const val = Math.floor(Math.random() * 3329) - 1664;
      row.push(val);
    }
    polynomialCoefficients.push(`[${row.join(', ')}]`);
  }

  const hashPart = Array.from({ length: 48 }, () => baseHex[Math.floor(Math.random() * 16)]).join('');
  
  return `ML-KEM-1024 (Kyber) State Matrix:\n` +
         `  R_q = ℤ_3329[X]/(X²⁵⁶ + 1)\n` +
         `  Vector t = A ∙ s + e (mod 3329)\n` +
         `  Coefficients:\n` +
         `    s₀: ${polynomialCoefficients[0]}\n` +
         `    s₁: ${polynomialCoefficients[1]}\n` +
         `    s₂: ${polynomialCoefficients[2]}\n` +
         `  Entropy Hash: 0x${hashPart}...`;
}

// Helper to generate traditional RSA-4096 cipher blocks for comparison
export function generateTraditionalCipher(plainText: string): string {
  const baseHex = "0123456789ABCDEF";
  const bytes = Array.from({ length: 128 }, () => baseHex[Math.floor(Math.random() * 16)]).join('');
  return `RSA-4096 Ciphertext (Factorization Dependent):\n  0x${bytes.substring(0, 32)}\n  ${bytes.substring(32, 64)}\n  ${bytes.substring(64, 96)}\n  ${bytes.substring(96, 128)}...`;
}

// Random feeds of normal activities to keep the real-time simulation buzzing!
export const NORMAL_RESOURCES = [
  { resource: 'prod_database_schema_v2', action: 'READ', risk: 2 },
  { resource: 'core_ledger_audit_july', action: 'READ', risk: 4 },
  { resource: 'gitlab.bank.com/infra/deployment', action: 'DOCKER_BUILD', risk: 3 },
  { resource: 'customer_address_validator_api', action: 'EXECUTE', risk: 1 },
  { resource: 'compliance_checker_service', action: 'CHECK', risk: 2 },
  { resource: 'customer_DB_master_creds', action: 'READ_METADATA', risk: 5 }
];

export const ANOMALOUS_RESOURCES = [
  { resource: 'customer_database_raw_dump', action: 'EXPORT', risk: 45, reason: 'Massive data volume pull in short timeframe' },
  { resource: 'payment_settlement_api_root', action: 'DECRYPT_SECRET', risk: 55, reason: 'Root key decryption attempted without change ticket' },
  { resource: 'ssh_gatekeeper_production', action: 'PORT_SCAN', risk: 40, reason: 'Internal port-scanning behaviors detected on network gateway' }
];
