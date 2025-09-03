export interface Dashboard {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface SharedCollection {
  id: string;
  user_id: string;
  name: string;
  share_token: string;
  tiles_data: any[];
  created_at: string;
  expires_at?: string;
}