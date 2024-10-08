import { connection_details, mass_connection_details, playerTeamHistory, teamSchema } from './api.interfaces.ts';
import { API_BASE } from '../consts.ts';
import { playerSchema } from './api.interfaces.ts';
import { Filter, inputScoreRowSchema, scoreRowSchema } from '../interfaces.ts';

const customFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const updatedOptions = {
    ...options,
    headers,
  };

  return fetch(API_BASE + url, updatedOptions);
};

export const fetch_all_players = async (): Promise<playerSchema[]> => {
  const response = await customFetch(`/players`);
  return response.json();
};

export const fetch_players_by_name = async (name: string, searchFromMiddle = true): Promise<playerSchema[]> => {
  const response = await customFetch(`/players/search?name=${name}&search_from_middle=${searchFromMiddle}`);
  return response.json();
};

export const fetch_players_with_filters = async (filter1: Filter, filter2: Filter): Promise<playerSchema[]> => {
  const response = await customFetch(
      `/games/grid/all_answers?type1=${filter1.type}&value1=${filter1.code}&type2=${filter2.type}&value2=${filter2.code}`
  );
  return response.json();
};

export const fetch_teams = async (): Promise<Filter[]> => {
  const response = await customFetch(`/teams`);
  return (await response.json()).map((team: teamSchema) => {
    return { type: 'team', code: team.team_id, name: team.name, image: team.img_ref.replace('tiny', 'big') };
  });
};

export const fetch_scoreboard = async (board: string): Promise<scoreRowSchema[]> => {
  const response = await customFetch(`/scoreboard/${board}`);
  return response.json();
};

export const add_player_to_scoreboard = async (board: string, score_row: inputScoreRowSchema): Promise<void> => {
  const requestBody = JSON.stringify(score_row);
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': String(new Blob([requestBody]).size),
  };

  await customFetch(`/scoreboard/${board}`, {
    method: 'POST',
    headers,
    body: requestBody,
  });
}



export const fetch_connections = async (player_id1: string, player_id2: string): Promise<connection_details[]> => {
	const response = await customFetch(`/games/connect_players/connection_details?player1=${player_id1}&player2=${player_id2}`);

	return response.json();
};

export const fetch_path = async (
	player_id1: string,
	player_id2: string,
	players_to_ignore?: string[],
	teams_to_ignore?: string[],
): Promise<playerSchema[]> => {
	const url: string = `/games/connect_players/path?player1=${player_id1}&player2=${player_id2}`;
	if (players_to_ignore) url.concat(`&players_to_ignore=${players_to_ignore.join(',')}`);
	if (teams_to_ignore) url.concat(`&teams_to_ignore=${teams_to_ignore.join(',')}`);
	const response = await customFetch(url);

	return response.json();
};

export const mass_fetch_connections = async (player_id: string, players: string[]): Promise<mass_connection_details[]> => {
	const response = await customFetch(`/games/connect_players/mass_connection_details?player_id=${player_id}&players=${players.join(',')}`);

	return response.json();
};

export const fetch_all_players_from_league_year = async (league_id: string, year: string): Promise<playerSchema[]> => {
	const response = await customFetch(`/players/league/${league_id}/${year}`);

	return response.json();
};

export const fetch_all_players_from_team = async (team_id: string, year: string): Promise<playerSchema[]> => {
	const response = await customFetch(`/players/team/${team_id}/${year}`);

	return response.json();
};

export const fetch_player_history = async (player_id: string): Promise<playerTeamHistory[]> => {
	const response = await customFetch(`/player_teams/team_history/${player_id}`);

	return response.json();
};
