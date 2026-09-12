import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { signIn, signUp, signInWithOAuth, loading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, username);
      }
    } catch (err) {
      // Error already handled in store
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏛️</div>
          <h1 className="text-3xl font-bold text-white mb-2">Évora Through Time</h1>
          <p className="text-gray-300 text-sm">Entra para guardar o teu progresso e competir!</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                mode === 'login'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                mode === 'register'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              Registar
            </button>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-2 mb-4">
            <button
              onClick={() => signInWithOAuth('google')}
              className="w-full py-2 px-4 bg-white text-gray-800 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <span>🔵</span> Continuar com Google
            </button>
            <button
              onClick={() => signInWithOAuth('github')}
              className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg font-medium text-sm hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>⚫</span> Continuar com GitHub
            </button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-transparent text-gray-400">ou</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="block text-xs text-gray-300 mb-1">Nome de utilizador</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="O teu nome de explorador"
                  className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-xs text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="o-teu-email@exemplo.com"
                className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-2 text-red-300 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-sm hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
            >
              {loading ? '⏳ A processar...' : mode === 'login' ? '🚀 Entrar' : '✨ Criar Conta'}
            </button>
          </form>
        </div>

        {/* Skip button */}
        <div className="text-center mt-4">
          <button
            onClick={() => {
              // Skip auth - use local mode
              window.location.reload();
            }}
            className="text-gray-400 text-xs hover:text-white transition-colors"
          >
            Continuar sem conta (modo local)
          </button>
        </div>
      </div>
    </div>
  );
}
