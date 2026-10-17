export type UserType = 'opportunity_provider' | 'career_seeker' | 'founder' | 'mentor' | 'collaborator';

export type AvailabilityStatus = 'active' | 'open_for_coffee' | 'hiring' | 'mentoring' | 'incognito';

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  verified?: boolean;
}

export interface PortfolioLink {
  label: string;
  url: string;
  icon: 'github' | 'globe' | 'linkedin' | 'dribbble';
}

export interface OpportunityBeacon {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  type: 'full-time' | 'co-founder' | 'mentorship' | 'contract' | 'collaboration';
  organization: string;
  description: string;
  compensation?: string;
  equity?: string;
  skills: string[];
  radiusKm: number;
  locationName: string;
  lat: number;
  lng: number;
  postedAgo: string;
  isVerifiedOrg: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  headline: string;
  title: string;
  company?: string;
  avatar: string;
  type: UserType;
  intentStatus: 'Hiring' | 'Looking';
  roleTag: string;
  bio: string;
  locationName: string;
  lat: number;
  lng: number;
  skills: string[];
  lookingFor: string;
  offering: string;
  availability: AvailabilityStatus;
  isVerified: boolean;
  verifiedLabel?: string;
}

export interface CareerProfile {
  id: string;
  name: string;
  headline: string;
  company?: string;
  avatar: string;
  type: UserType;
  intentStatus: 'Hiring' | 'Looking';
  roleTag: string;
  bio: string;
  locationName: string;
  lat: number;
  lng: number;
  distanceKm: number; // calculated relative to user
  angleDeg: number; // bearing relative to user
  skills: string[];
  lookingFor: string;
  offering: string;
  experience: ExperienceItem[];
  portfolioLinks: PortfolioLink[];
  isVerified: boolean;
  verifiedLabel?: string;
  availability: AvailabilityStatus;
  activeOpportunity?: OpportunityBeacon;
  lastActive: string;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  fromUserHeadline: string;
  toUserId: string;
  toUserName: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  opportunityTitle?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  attachment?: {
    type: 'opportunity' | 'coffee_invite';
    title: string;
    detail: string;
  };
}

export interface Conversation {
  id: string;
  participant: CareerProfile;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface SmartMatchResult {
  score: number; // 0 - 100
  matchingSkills: string[];
  roleSynergy: string;
  reasons: string[];
}
