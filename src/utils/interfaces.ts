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
}

export interface inputScoreRowSchema {
  nickname: string
  squares_number: number
  players_number: number
  time: number
}

export interface SecondarySortSchema {
  sortName: string;
  sortOrder: boolean;
}