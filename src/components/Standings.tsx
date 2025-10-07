import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, RotateCcw } from 'lucide-react';
import { Standing, Player, getStandings, getPlayers, resetData } from '../lib/localStorage';

interface StandingWithPlayer extends Standing {
  player: Player;
}

export default function Standings() {
  const [standings, setStandings] = useState<StandingWithPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStandings();

    const handleStandingsUpdate = () => {
      fetchStandings();
    };

    window.addEventListener('standings-updated', handleStandingsUpdate);

    return () => {
      window.removeEventListener('standings-updated', handleStandingsUpdate);
    };
  }, []);

  const fetchStandings = () => {
    try {
      const standingsData = getStandings();
      const playersData = getPlayers();

      const standingsWithPlayers: StandingWithPlayer[] = standingsData
        .map(standing => {
          const player = playersData.find(p => p.id === standing.player_id)!;
          return {
            ...standing,
            player
          };
        })
        .sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points;
          }
          return b.wins - a.wins;
        });

      setStandings(standingsWithPlayers);
    } catch (error) {
      console.error('Error fetching standings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{rank}</div>;
    }
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.')) {
      resetData();
    }
  };

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
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white">Classement</h2>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
          title="Réinitialiser toutes les données"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Rang</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Joueur</th>
              <th className="text-center py-4 px-4 text-sm font-semibold text-gray-400">J</th>
              <th className="text-center py-4 px-4 text-sm font-semibold text-gray-400">V</th>
              <th className="text-center py-4 px-4 text-sm font-semibold text-gray-400">N</th>
              <th className="text-center py-4 px-4 text-sm font-semibold text-gray-400">D</th>
              <th className="text-center py-4 px-4 text-sm font-semibold text-blue-400">Points</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;

              return (
                <tr
                  key={standing.id}
                  className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${
                    isTopThree ? 'bg-gradient-to-r from-gray-700/20 to-transparent' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-start">
                      {getRankIcon(rank)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        isTopThree ? 'bg-gradient-to-br from-red-600 to-red-700' : 'bg-gray-700'
                      }`}>
                        {standing.player.name.charAt(0).toUpperCase()}
                      </div>
                      <span className={`font-semibold ${isTopThree ? 'text-white text-lg' : 'text-gray-300'}`}>
                        {standing.player.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center text-gray-300">{standing.matches_played}</td>
                  <td className="py-4 px-4 text-center text-green-400 font-semibold">{standing.wins}</td>
                  <td className="py-4 px-4 text-center text-gray-400">{standing.draws}</td>
                  <td className="py-4 px-4 text-center text-red-400 font-semibold">{standing.losses}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block bg-blue-600 text-white font-bold py-1 px-3 rounded-full">
                      {standing.points}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          <p className="mb-2"><span className="font-semibold text-white">J</span> = Matches Joués</p>
          <p className="mb-2"><span className="font-semibold text-green-400">V</span> = Victoires</p>
          <p className="mb-2"><span className="font-semibold text-gray-300">N</span> = Nuls</p>
          <p className="mb-2"><span className="font-semibold text-red-400">D</span> = Défaites</p>
          <p className="text-blue-400 font-semibold">Victoire = 1 point | Nul = 0.5 point | Défaite = 0 point</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="text-xs text-gray-500 text-center">
          Les données sont stockées localement dans votre navigateur
        </div>
      </div>
    </div>
  );
}
