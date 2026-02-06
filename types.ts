
export interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  videoUrl: string;
  location: string;
  tags: string[];
}

export interface MatchResult {
  profile: Profile;
  message: string;
}
