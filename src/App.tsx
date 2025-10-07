import ChessBackground from './components/ChessBackground';
import Calendar from './components/Calendar';
import Standings from './components/Standings';
import { Crown } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen relative">
      <ChessBackground />

      <div className="relative z-10">
        <header className="bg-gradient-to-r from-red-600 via-red-700 to-blue-700 shadow-2xl border-b-4 border-red-500">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-center gap-4">
              <Crown className="w-12 h-12 text-yellow-300" />
              <h1 className="text-5xl font-bold text-white tracking-tight">
                Forces' Chess League
              </h1>
              <Crown className="w-12 h-12 text-yellow-300" />
            </div>
            <p className="text-center text-red-100 mt-3 text-lg">
              Tournoi Round-Robin • 10 Joueurs • 20 Jours
            </p>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <Calendar />
            </div>
            <div>
              <Standings />
            </div>
          </div>
        </main>

        <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 mt-16">
          <div className="container mx-auto px-6 py-6 text-center text-gray-400">
            <p>© 2025 Forces' Chess League • Tous droits réservés</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
