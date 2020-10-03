declare namespace Express {
  interface Request {
    twitch: {
      broadcaster_type: BroadecasterType;
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

type BroadecasterType = "partner" | "affiliate" | "";
type type = "staff" | "admin" | "global_mod" | "";
