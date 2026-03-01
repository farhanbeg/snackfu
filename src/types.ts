export type Campus = "Burnaby" | "Surrey" | "Vancouver";
export type Category = "Social" | "Career" | "Academic" | "Culture" | "Sports" | "Volunteer" | "Other";
export type SourceType = "Discord" | "Instagram" | "SFU";

export interface Event {
  id: string;
  title: string;
  club: string;
  campus: Campus;
  location: string;
  start: string; // ISO string
  end: string;   // ISO string
  category: Category;
  snacks: {
    has: boolean;
    types?: string[];
  };
  freeToJoin: boolean;
  joinLink: string;
  sourceType: SourceType;
  sourceLink: string;
  description?: string;
}

export interface FilterState {
  campuses: Campus[];
  snacksOnly: boolean;
  category: Category | "All";
  freeToJoinOnly: boolean;
  search: string;
}
