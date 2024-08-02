export interface teamSchema {
	name: string;
	league_id: string;
	ref: string;
	team_id: string;
	img_ref: string;
}

export interface leagueSchema {
	league_id: string;
	name: string;
	img_ref: string;
}

export interface nationalitySchema {
	name: string;
}

export interface playerSchema {
	player_id: number;
	name: string;
	name_unaccented: string;
	birth_date: string;
	img_ref: string;
}

interface specialSchema {
	special_id: string;
	name: string;
	ref: string;
	img_ref: string;
	type: string;
}

export interface managerSchema extends specialSchema {
	type: 'manager';
}

export interface titleSchema extends specialSchema {
	type: 'cup_winner' | 'league_winner';
}

export type filterSchema = teamSchema | leagueSchema | nationalitySchema | playerSchema | managerSchema | titleSchema;

export interface scoreRowSchema {
	row_id: number;
	nickname: string;
	squares_number: number;
	players_number: number;
	shortest_path: number;
	time: number;
	board: string;
}

export interface inputScoreRowSchema {
	nickname: string;
	squares_number: number;
	players_number: number;
	shortest_path: number;
	time: number;
}

export interface SortSchema {
	sortName: string;
	sortOrder: 'asc' | 'desc';
}

export interface playerTeamHistory {
	player_id: string;
	team_id: string;
	team: string;
	team_img: string;
	years: string;
	league_id: string;
	league: string;
	league_img: string;
}

export interface connection_details {
	team_name: string;
	years: string;
}

export interface mass_connection_details {
	player_id: string;
	connections: connection_details[];
}
