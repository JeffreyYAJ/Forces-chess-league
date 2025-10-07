export type Player = {
  id: string;
  name: string;
  created_at: string;
};

export type Match = {
  id: string;
  day: number;
  match_number: number;
  white_player_id: string;
  black_player_id: string;
  white_score: number | null;
  black_score: number | null;
  status: 'scheduled' | 'completed';
  created_at: string;
};

export type Standing = {
  id: string;
  player_id: string;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  updated_at: string;
};

const STORAGE_KEYS = {
  PLAYERS: 'chess_league_players',
  MATCHES: 'chess_league_matches',
  STANDINGS: 'chess_league_standings',
  INITIALIZED: 'chess_league_initialized'
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getFromStorage<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function initializeData(): void {
  if (localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    return;
  }

  const playerNames = [
    'Ndiffokou',
    'DavidoScam',
    'Docteur_911',
    'Backslash057',
    'BG_Emmanuel',
    'Anshi_X',
    'Hking237',
    'coolmoode',
    'yaj_24',
    'The_listenerxx'
  ];

  const players: Player[] = playerNames.map(name => ({
    id: generateId(),
    name,
    created_at: new Date().toISOString()
  }));

  saveToStorage(STORAGE_KEYS.PLAYERS, players);

  const matches: Match[] = [
		{
			id: generateId(),
			day: 1,
			match_number: 1,
			white_player_id: players[0].id, // Ndiffokou
			black_player_id: players[4].id, // BG_Emmanuel
			white_score: null,
			black_score: null,
			status: "scheduled",
			created_at: new Date().toISOString(),
		},
		{
			id: generateId(),
			day: 1,
			match_number: 2,
			white_player_id: players[6].id, // Hking237
			black_player_id: players[5].id, // Anshi_X
			white_score: null,
			black_score: null,
			status: "scheduled",
			created_at: new Date().toISOString(),
		},
	];
  // let matchCount = 0;

  

  // // const day = Math.floor(0 / 2) + 1;
	// // const matchNumber = (0 % 2) + 1;
  // // matches.push({
	// // 	id: generateId(),
	// // 	day,
	// // 	match_number: matchNumber,
	// // 	white_player_id: ,
	// // 	black_player_id: "BG_Emmanuel",
	// // 	white_score: null,
	// // 	black_score: null,
	// // 	status: "scheduled",
	// // 	created_at: new Date().toISOString(),
	// // });





  saveToStorage(STORAGE_KEYS.MATCHES, matches);

  const standings: Standing[] = players.map(player => ({
    id: generateId(),
    player_id: player.id,
    matches_played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    points: 0,
    updated_at: new Date().toISOString()
  }));

  saveToStorage(STORAGE_KEYS.STANDINGS, standings);

  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
}

export function getPlayers(): Player[] {
  return getFromStorage<Player>(STORAGE_KEYS.PLAYERS);
}

export function getMatches(): Match[] {
  return getFromStorage<Match>(STORAGE_KEYS.MATCHES);
}

export function getStandings(): Standing[] {
  return getFromStorage<Standing>(STORAGE_KEYS.STANDINGS);
}

export function updateMatch(matchId: string, white_score: number, black_score: number): void {
  const matches = getMatches();
  const matchIndex = matches.findIndex(m => m.id === matchId);

  if (matchIndex !== -1) {
    matches[matchIndex].white_score = white_score;
    matches[matchIndex].black_score = black_score;
    matches[matchIndex].status = 'completed';
    saveToStorage(STORAGE_KEYS.MATCHES, matches);
    updateStandings();
  }
}

export function updateStandings(): void {
  const players = getPlayers();
  const matches = getMatches().filter(m => m.status === 'completed');
  const standings = getStandings();

  const playerStats: Record<string, { wins: number; draws: number; losses: number; points: number; played: number }> = {};

  players.forEach(player => {
    playerStats[player.id] = { wins: 0, draws: 0, losses: 0, points: 0, played: 0 };
  });

  matches.forEach(match => {
    if (match.white_score !== null && match.black_score !== null) {
      playerStats[match.white_player_id].played++;
      playerStats[match.black_player_id].played++;
      playerStats[match.white_player_id].points += match.white_score;
      playerStats[match.black_player_id].points += match.black_score;

      if (match.white_score === 1) {
        playerStats[match.white_player_id].wins++;
        playerStats[match.black_player_id].losses++;
      } else if (match.black_score === 1) {
        playerStats[match.black_player_id].wins++;
        playerStats[match.white_player_id].losses++;
      } else {
        playerStats[match.white_player_id].draws++;
        playerStats[match.black_player_id].draws++;
      }
    }
  });

  const updatedStandings = standings.map(standing => ({
    ...standing,
    matches_played: playerStats[standing.player_id].played,
    wins: playerStats[standing.player_id].wins,
    draws: playerStats[standing.player_id].draws,
    losses: playerStats[standing.player_id].losses,
    points: playerStats[standing.player_id].points,
    updated_at: new Date().toISOString()
  }));

  saveToStorage(STORAGE_KEYS.STANDINGS, updatedStandings);
  window.dispatchEvent(new CustomEvent('standings-updated'));
}

export function resetData(): void {
  localStorage.removeItem(STORAGE_KEYS.PLAYERS);
  localStorage.removeItem(STORAGE_KEYS.MATCHES);
  localStorage.removeItem(STORAGE_KEYS.STANDINGS);
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  initializeData();
  window.location.reload();
}
