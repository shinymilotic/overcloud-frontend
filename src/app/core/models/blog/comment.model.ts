import { Profile } from "../auth/profile.model";

export interface Comment {
  id: string;
  body: string;
  createdAt: string;
  author: Profile;
}
