export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
};

export type Series = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  trailer_url: string | null;
  price_cents: number;
  category: string | null;
  is_published: boolean;
  created_at: string;
};

export type Video = {
  id: string;
  series_id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  position: number;
  duration_seconds: number | null;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  status: string | null;
  price_id: string | null;
  current_period_end: string | null;
  created_at: string;
};

export type Purchase = {
  id: string;
  user_id: string;
  series_id: string;
  stripe_checkout_id: string | null;
  amount_paid_cents: number;
  created_at: string;
};

export type CoachMessage = {
  id: string;
  user_id: string;
  coach_id: string | null;
  content: string | null;
  video_url: string | null;
  is_from_coach: boolean;
  parent_id: string | null;
  created_at: string;
};
