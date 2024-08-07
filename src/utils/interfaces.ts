export interface Filter {
  code: string;
  type: string;
  image: string;
  name: string;
}

export interface scoreRowSchema {
  row_id: number
  nickname: string
  squares_number: number
  players_number: number
  time: number
  board: string
  shortest_path: number
}

export interface inputScoreRowSchema {
  nickname: string
  squares_number?: number
  players_number: number
  time: number
  shortest_path?: number
}

export interface SecondarySortSchema {
  sortName: string;
  sortOrder: boolean;
}