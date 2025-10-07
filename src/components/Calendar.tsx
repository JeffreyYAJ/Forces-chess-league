import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Trophy, List } from 'lucide-react';
import { Match, Player, getMatches, getPlayers, updateMatch, initializeData } from '../lib/localStorage';

interface MatchWithPlayers extends Match {
  white_player: Player;
  black_player: Player;
}

export default function Calendar() {
  const [matches, setMatches] = useState<MatchWithPlayers[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'day' | 'all'>('day');

  useEffect(() => {
    initializeData();
    fetchMatches();
  }, []);

  const fetchMatches = () => {
    try {
      const matchesData = getMatches();
      const playersData = getPlayers();

      const matchesWithPlayers: MatchWithPlayers[] = matchesData.map(match => {
        const whitePlayer = playersData.find(p => p.id === match.white_player_id)!;
        const blackPlayer = playersData.find(p => p.id === match.black_player_id)!;

        return {
          ...match,
          white_player: whitePlayer,
          black_player: blackPlayer
        };
      });

      setMatches(matchesWithPlayers);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMatchResult = (matchId: string, result: 'white' | 'black' | 'draw') => {
    try {
      let white_score: number, black_score: number;

      if (result === 'white') {
        white_score = 1;
        black_score = 0;
      } else if (result === 'black') {
        white_score = 0;
        black_score = 1;
      } else {
        white_score = 0.5;
        black_score = 0.5;
      }

      updateMatch(matchId, white_score, black_score);
      fetchMatches();
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  const displayMatches = viewMode === 'day' ? matches.filter(m => m.day === selectedDay) : matches;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-red-500" />
          <h2 className="text-3xl font-bold text-white">Calendrier de la Ligue</h2>
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'day' ? 'all' : 'day')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
        >
          <List className="w-5 h-5" />
          {viewMode === 'day' ? 'Vue globale' : 'Vue par jour'}
        </button>
      </div>

      {viewMode === 'day' && (
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mb-8">
          {Array.from({ length: 20 }, (_, i) => i + 1).map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`py-3 px-2 rounded-lg font-semibold transition-all duration-200 ${
                selectedDay === day
                  ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg scale-105'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              J{day}
            </button>
          ))}
        </div>
      )}

      <div className={viewMode === 'all' ? 'space-y-8' : 'space-y-4'}>
        {viewMode === 'all' ? (
          Array.from({ length: 20 }, (_, i) => i + 1).map(day => {
            const dayMatchList = matches.filter(m => m.day === day);
            return (
              <div key={day} className="border border-gray-600 rounded-xl p-6 bg-gray-800/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-lg">Jour {day}</span>
                </h3>
                <div className="space-y-4">
                  {dayMatchList.map((match, index) => (
                    <MatchCard key={match.id} match={match} index={index} updateMatchResult={updateMatchResult} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          displayMatches.map((match, index) => (
            <MatchCard key={match.id} match={match} index={index} updateMatchResult={updateMatchResult} />
          ))
        )}
      </div>
    </div>
  );
}

function MatchCard({
  match,
  index,
  updateMatchResult
}: {
  match: MatchWithPlayers;
  index: number;
  updateMatchResult: (matchId: string, result: 'white' | 'black' | 'draw') => void
}) {
  return (
		<div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-6 border border-gray-600 hover:border-blue-500/50 transition-all duration-200">
			<div className="flex items-center justify-between mb-4">
				<div className="text-sm font-semibold text-blue-400">
					Match {index + 1}
				</div>
				{match.status === "completed" && (
					<div className="flex items-center gap-1 text-green-400 text-sm">
						<Trophy className="w-4 h-4" />
						Terminé
					</div>
				)}
			</div>

			<div className="flex items-center justify-between gap-4">
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-2">
						<div className="w-6 h-6 rounded-full bg-white border-2 border-gray-600"></div>
						<span className="text-white font-semibold">
							{match.white_player.name}
						</span>
						{/* <span className="text-white font-semibold">Ndiffokou</span> */}
					</div>
					<div className="flex items-center gap-2">
						<div className="w-6 h-6 rounded-full bg-black border-2 border-gray-400"></div>
						<span className="text-white font-semibold">
							{match.black_player.name}
						</span>
					</div>
				</div>

				<div className="text-center">
					{match.status === "completed" ? (
						<div className="text-2xl font-bold text-white">
							<div>{match.white_score}</div>
							<div className="text-gray-500 text-sm my-1">-</div>
							<div>{match.black_score}</div>
						</div>
					) : (
						<div className="flex flex-col gap-2">
							<button
								onClick={() => updateMatchResult(match.id, "white")}
								className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm"
							>
								Blanc gagne
							</button>
							<button
								onClick={() => updateMatchResult(match.id, "draw")}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
							>
								Match nul
							</button>
							<button
								onClick={() => updateMatchResult(match.id, "black")}
								className="px-4 py-2 bg-black text-white border border-gray-600 rounded-lg hover:bg-gray-900 transition-colors font-semibold text-sm"
							>
								Noir gagne
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
