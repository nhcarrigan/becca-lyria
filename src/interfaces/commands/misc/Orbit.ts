interface OrbitAttributes {
  activities_count: number;
  avatar_url: string;
  bio: string;
  birthday: string | null;
  company: string;
  created_at: string;
  deleted_at: string | null;
  first_activity_occured_at: string;
  id: number;
  last_activity_occured_at: string;
  location: string;
  name: string;
  orbit_level: number;
  pronouns: string | null;
  reach: number;
  shipping_address: string | null;
  slug: string;
  source: string;
  tag_list: string[];
  tags: string[];
  teammate: boolean;
  tshirt: string | null;
  updated_at: string;
  merged_at: string;
  url: string;
  orbit_url: string;
  created: boolean;
  love: number;
  twitter: string | null;
  github: string | null;
  discourse: string | null;
  email: string;
  devto: string | null;
  linkedin: string | null;
  github_followers: number | null;
  twitter_followers: number | null;
  topics: string[];
  languages: string[];
}

interface OrbitRelationships {
  identities: {
    data: {
      id: string;
      type: string;
    }[];
  };
}

export interface OrbitData {
  data: OrbitMember[];
  links: {
    first: string;
    prev: string | null;
    next: string | null;
  };
}

export interface IndividualOrbitData {
  data: OrbitMember;
}

export interface OrbitMember {
  id: string;
  type: string;
  attributes: OrbitAttributes;
  relationships: OrbitRelationships;
}
