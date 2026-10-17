import { CareerProfile, OpportunityBeacon, SmartMatchResult } from '../types';

export function calculateSmartMatch(
  myProfile: {
    type: string;
    skills: string[];
    lookingFor: string;
    title: string;
  },
  candidate: CareerProfile,
  opportunity?: OpportunityBeacon
): SmartMatchResult {
  const targetSkills = opportunity ? opportunity.skills : candidate.skills;
  const mySkillsLower = myProfile.skills.map(s => s.toLowerCase().trim());
  
  const matchingSkills = targetSkills.filter(skill =>
    mySkillsLower.includes(skill.toLowerCase().trim())
  );

  let score = 50; // base compatibility
  const reasons: string[] = [];

  // 1. Skill overlap score (up to +35 pts)
  if (targetSkills.length > 0) {
    const skillRatio = matchingSkills.length / Math.max(1, targetSkills.length);
    const skillPoints = Math.round(skillRatio * 35);
    score += skillPoints;
    if (matchingSkills.length > 0) {
      reasons.push(`${matchingSkills.length} shared core skill${matchingSkills.length > 1 ? 's' : ''}: ${matchingSkills.slice(0, 3).join(', ')}`);
    }
  }

  // 2. Role Complementarity (+15 pts)
  let roleSynergy = 'High Professional Alignment';
  if (candidate.type === 'opportunity_provider' || opportunity) {
    roleSynergy = 'Direct Career Opportunity';
    score += 15;
    reasons.push('Actively recruiting for your specific expertise');
  } else if (candidate.type === 'founder') {
    roleSynergy = 'Co-Founder Complementarity';
    score += 14;
    reasons.push('Founder looking for technical co-builder');
  } else if (candidate.type === 'mentor') {
    roleSynergy = 'Senior Mentorship Match';
    score += 12;
    reasons.push('Seasoned tech lead offering career guidance');
  } else if (candidate.type === 'collaborator') {
    roleSynergy = 'Peer Collaboration';
    score += 10;
    reasons.push('Open for pair programming and hackathons');
  }

  // 3. Proximity bonus (+5 pts)
  if (candidate.distanceKm <= 2.0) {
    score += 5;
    reasons.push(`Hyper-local proximity (${candidate.distanceKm} km away in ${candidate.locationName})`);
  } else if (candidate.distanceKm <= 5.0) {
    score += 3;
    reasons.push(`Within quick coffee radius (${candidate.distanceKm} km)`);
  }

  // Verification trust factor (+5 pts)
  if (candidate.isVerified) {
    score += 3;
    reasons.push('Verified organization/practitioner credential');
  }

  // Clamp score between 60% and 99% for high quality presentation
  const finalScore = Math.min(99, Math.max(62, score));

  return {
    score: finalScore,
    matchingSkills,
    roleSynergy,
    reasons,
  };
}
