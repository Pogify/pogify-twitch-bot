declare namespace Express {
  interface Request {
    twitch?: {
      broadcaster_type: BroadcasterType;
      description: string;
      display_name: string;
      email?: string;
      id: string;
      login: string;
      offline_image_url: string;
      profile_image_url: string;
      type: type;
      view_count: number;
      created_at: string;
    };
  }
}

type BroadcasterType = "partner" | "affiliate" | "";
type type = "staff" | "admin" | "global_mod" | "";
