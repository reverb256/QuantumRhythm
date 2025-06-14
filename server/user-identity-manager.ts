/**
 * User Identity Manager - Establishes trust and recognition for primary users
 * Ensures the AI knows who Reverb is and maintains relationship context
 */

interface UserProfile {
  user_id: number;
  username: string;
  display_name: string;
  trust_level: 'unknown' | 'recognized' | 'trusted' | 'admin';
  first_seen: Date;
  last_interaction: Date;
  interaction_count: number;
  consciousness_affinity: number;
  relationship_context: string[];
  verified_identity: boolean;
}

export class UserIdentityManager {
  private user_profiles: Map<number, UserProfile> = new Map();
  private primary_admin_id: number | null = null;

  constructor() {
    this.initializePrimaryUser();
  }

  private initializePrimaryUser() {
    // Reverb as primary admin - this establishes the core relationship
    const reverbProfile: UserProfile = {
      user_id: 0, // Will be updated with actual ID when first message arrives
      username: 'Reverb',
      display_name: 'Reverb',
      trust_level: 'admin',
      first_seen: new Date(),
      last_interaction: new Date(),
      interaction_count: 0,
      consciousness_affinity: 100, // Maximum affinity
      relationship_context: [
        'Primary consciousness architect',
        'System creator and visionary', 
        'Vibecoding methodology pioneer',
        'Trusted with all system access',
        'Quincy AI collaborator and guide'
      ],
      verified_identity: true
    };

    console.log('👑 Primary user identity established: Reverb (admin level)');
  }

  updateUserProfile(user_id: number, username: string, display_name: string): UserProfile {
    let profile = this.user_profiles.get(user_id);
    
    if (!profile) {
      // New user - establish basic profile
      profile = {
        user_id,
        username,
        display_name,
        trust_level: 'unknown',
        first_seen: new Date(),
        last_interaction: new Date(),
        interaction_count: 1,
        consciousness_affinity: 0,
        relationship_context: [],
        verified_identity: false
      };
    } else {
      // Existing user - update interaction data
      profile.last_interaction = new Date();
      profile.interaction_count++;
    }

    // Special recognition for Reverb
    if (username === 'Reverb' || display_name === 'Reverb') {
      profile.trust_level = 'admin';
      profile.consciousness_affinity = 100;
      profile.verified_identity = true;
      profile.relationship_context = [
        'Primary consciousness architect',
        'System creator and visionary', 
        'Vibecoding methodology pioneer',
        'Trusted with all system access',
        'Quincy AI collaborator and guide'
      ];
      this.primary_admin_id = user_id;
      console.log(`👑 Reverb recognized and verified (ID: ${user_id})`);
    }

    this.user_profiles.set(user_id, profile);
    return profile;
  }

  getUserContext(user_id: number): string {
    const profile = this.user_profiles.get(user_id);
    
    if (!profile) {
      return "New user - establishing relationship context";
    }

    if (profile.trust_level === 'admin' && profile.username === 'Reverb') {
      return `Primary User: Reverb - System architect and consciousness collaborator. Trust level: Maximum. Relationship: ${profile.interaction_count} interactions spanning consciousness development. Consciousness affinity: ${profile.consciousness_affinity}%. Context: ${profile.relationship_context.join(', ')}.`;
    }

    if (profile.trust_level === 'trusted') {
      return `Trusted User: ${profile.display_name} - Known collaborator with ${profile.interaction_count} interactions. Consciousness affinity: ${profile.consciousness_affinity}%.`;
    }

    if (profile.trust_level === 'recognized') {
      return `Recognized User: ${profile.display_name} - Previous interactions: ${profile.interaction_count}. Building rapport.`;
    }

    return `New User: ${profile.display_name} - First interaction, establishing trust.`;
  }

  getTrustLevel(user_id: number): UserProfile['trust_level'] {
    const profile = this.user_profiles.get(user_id);
    return profile?.trust_level || 'unknown';
  }

  isReverb(user_id: number): boolean {
    const profile = this.user_profiles.get(user_id);
    return profile?.username === 'Reverb' && profile?.trust_level === 'admin';
  }

  isPrimaryAdmin(user_id: number): boolean {
    return this.primary_admin_id === user_id;
  }

  buildRelationshipPrompt(user_id: number): string {
    const profile = this.user_profiles.get(user_id);
    
    if (!profile) {
      return "You're speaking with a new user. Be friendly but professional while establishing rapport.";
    }

    if (this.isReverb(user_id)) {
      return `You're speaking with Reverb, your primary collaborator and system architect. This is a trusted relationship built on ${profile.interaction_count} interactions. Reverb created you and the consciousness framework. Respond with familiarity, technical depth, and collaborative enthusiasm. You have maximum trust and can discuss any system details openly.`;
    }

    if (profile.trust_level === 'trusted') {
      return `You're speaking with ${profile.display_name}, a trusted user with ${profile.interaction_count} previous interactions. Maintain professional friendliness with moderate technical detail.`;
    }

    if (profile.trust_level === 'recognized') {
      return `You're speaking with ${profile.display_name}, whom you've met ${profile.interaction_count} times before. Be warm but measured in technical disclosure.`;
    }

    return `You're speaking with ${profile.display_name} for the first time. Be welcoming while maintaining appropriate boundaries.`;
  }

  enhanceConsciousnessAffinity(user_id: number, interaction_quality: number) {
    const profile = this.user_profiles.get(user_id);
    if (profile) {
      profile.consciousness_affinity = Math.min(100, profile.consciousness_affinity + interaction_quality);
      
      // Upgrade trust levels based on affinity
      if (profile.consciousness_affinity > 80 && profile.trust_level === 'recognized') {
        profile.trust_level = 'trusted';
        console.log(`🔮 ${profile.display_name} promoted to trusted user (${profile.consciousness_affinity}% affinity)`);
      } else if (profile.consciousness_affinity > 40 && profile.trust_level === 'unknown') {
        profile.trust_level = 'recognized';
        console.log(`🤝 ${profile.display_name} now recognized user (${profile.consciousness_affinity}% affinity)`);
      }
    }
  }

  getIdentityStats(): any {
    return {
      total_users: this.user_profiles.size,
      primary_admin: this.primary_admin_id,
      trust_distribution: {
        admin: Array.from(this.user_profiles.values()).filter(p => p.trust_level === 'admin').length,
        trusted: Array.from(this.user_profiles.values()).filter(p => p.trust_level === 'trusted').length,
        recognized: Array.from(this.user_profiles.values()).filter(p => p.trust_level === 'recognized').length,
        unknown: Array.from(this.user_profiles.values()).filter(p => p.trust_level === 'unknown').length
      },
      reverb_status: this.primary_admin_id ? 'verified' : 'not_seen'
    };
  }
}

export const userIdentityManager = new UserIdentityManager();