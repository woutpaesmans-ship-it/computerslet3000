export interface Tile {
  id: string;
  user_id: string;
  title: string;
  content: string;
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'gray';
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const TILE_COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'gray'] as const;