import { useAuthStore } from '../store/authStore';
import { isSupabaseConfigured } from '../lib/supabase';

export default function AuthScreen() {
  const { signInAsGuest } = useAuthStore();

  // Se o Supabase não está configurado, entrar automaticamente
  if (!isSupabaseConfigured) {
    signInAsGuest();
    return null;
  }

  return (
    <div className="fixed inset-0 z-[3000] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🏛️</div>
          <h1 className="text-3xl font-bold text-white mb-2">Évora Through Time</h1>
          <p className="text-gray-300 text-sm">Configura o Supabase para guardar o teu progresso!</p>
        </div>

        {/* Info Box */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl mb-4">
          <h3 className="text-white font-bold mb-3">🔧 Configuração Necessária</h3>
          <p className="text-gray-300 text-sm mb-4">
            Para usar autenticação e multiplayer, configura o Supabase:
          </p>
          <ol className="text-gray-300 text-xs space-y-2 list-decimal list-inside">
            <li>Cria um projeto em <a href="https://supabase.com" target="_blank" className="text-purple-400 underline">supabase.com</a></li>
            <li>Executa o SQL em <code className="bg-white/10 px-1 rounded">supabase/schema.sql</code></li>
            <li>Copia o Project URL e anon key</li>
            <li>Cria um ficheiro <code className="bg-white/10 px-1 rounded">.env</code> com:
              <pre className="mt-1 bg-black/30 p-2 rounded text-[10px] overflow-x-auto">
{`VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...`}
              </pre>
            </li>
          </ol>
        </div>

        {/* Play as Guest */}
        <button
          onClick={signInAsGuest}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          🎮 Jogar sem conta (modo local)
        </button>
        
        <p className="text-gray-500 text-xs text-center mt-3">
          O progresso não será guardado no modo local
        </p>
      </div>
    </div>
  );
}
