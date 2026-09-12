# 🚀 Configuração do Supabase - Évora Through Time

## 📋 Passo a Passo

### 1. Criar Projeto no Supabase

1. Vai a [supabase.com](https://supabase.com)
2. Clica **"Start your project"**
3. Faz login com GitHub
4. Clica **"New Project"**
5. Preenche:
   - **Name**: `evora-through-time`
   - **Database Password**: (guarda esta password!)
   - **Region**: West Europe (para melhor performance em Portugal)
6. Clica **"Create new project"**
7. Espera ~2 minutos até o projeto estar pronto

---

### 2. Executar o Schema SQL

1. No dashboard do Supabase, vai a **SQL Editor** (ícone `</>` no menu lateral)
2. Clica **"New Query"**
3. Copia todo o conteúdo do ficheiro `supabase/schema.sql`
4. Cola no editor SQL
5. Clica **"Run"** (ou Ctrl+Enter)
6. Deves ver "Success. No rows returned" ✅

---

### 3. Obter as Credenciais

1. Vai a **Settings** → **API** (menu lateral)
2. Copia estes valores:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (chave longa)

---

### 4. Configurar Variáveis de Ambiente

#### Local (para testar):

Cria um ficheiro `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

#### Vercel (para produção):

1. Vai ao dashboard do Vercel
2. Seleciona o teu projeto
3. Vai a **Settings** → **Environment Variables**
4. Adiciona:
   - `VITE_SUPABASE_URL` = `https://xxxxx.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGc...`
5. Clica **"Save"**
6. Faz **Redeploy** do projeto

---

### 5. Configurar Authentication

1. No Supabase, vai a **Authentication** → **Providers**
2. Ativa os providers que queres:

#### Email/Password (já ativo por defeito):
- ✅ Enable "Email" provider
- Configura templates de email (opcional)

#### Google OAuth:
1. Vai a [Google Cloud Console](https://console.cloud.google.com)
2. Cria um novo projeto (ou usa um existente)
3. Vai a **APIs & Services** → **Credentials**
4. Clica **"Create Credentials"** → **"OAuth client ID"**
5. Configura:
   - **Application type**: Web application
   - **Authorized redirect URIs**: 
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```
6. Copia o **Client ID** e **Client Secret**
7. No Supabase → Authentication → Providers → Google
8. Cola o Client ID e Client Secret
9. Clica **"Save"**

#### GitHub OAuth:
1. Vai a [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Clica **"New OAuth App"**
3. Preenche:
   - **Application name**: Évora Through Time
   - **Homepage URL**: `https://teu-site.vercel.app`
   - **Authorization callback URL**: 
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```
4. Clica **"Register application"**
5. Copia o **Client ID** e gera um **Client Secret**
6. No Supabase → Authentication → Providers → GitHub
7. Cola o Client ID e Client Secret
8. Clica **"Save"**

---

### 6. Ativar Realtime

1. No Supabase, vai a **Database** → **Replication**
2. Ativa as tabelas:
   - ✅ `player_positions`
   - ✅ `chat_messages`

---

### 7. Testar!

1. Faz push do código para o GitHub
2. O Vercel vai fazer deploy automaticamente
3. Abre o site no browser
4. Deves ver o ecrã de autenticação
5. Regista uma conta ou entra com Google/GitHub
6. O teu progresso agora é guardado na cloud! 🎉

---

## 🔧 Troubleshooting

### Erro: "Invalid API key"
- Verifica se copiaste a **anon key** correta
- Confirma que as variáveis de ambiente começam com `VITE_`

### Erro: "new row violates row-level security policy"
- Confirma que executaste o SQL completo
- Verifica que o RLS está ativado nas tabelas

### Erro: "relation does not exist"
- Executa o SQL novamente
- Confirma que estás na base de dados correta

### Realtime não funciona:
- Confirma que ativaste a replicação nas tabelas
- Verifica o browser console para erros
- Confirma que estás autenticado

---

## 📊 Monitorizar a Base de Dados

### Ver todos os jogadores:
```sql
SELECT * FROM players ORDER BY points DESC;
```

### Ver leaderboard:
```sql
SELECT * FROM leaderboard LIMIT 10;
```

### Ver jogadores online:
```sql
SELECT * FROM online_players;
```

### Limpar posições antigas:
```sql
SELECT cleanup_old_positions();
```

---

## 💰 Custos do Supabase (Plano Gratuito)

- ✅ **500 MB** de base de dados
- ✅ **5 GB** de transferência mensal
- ✅ **50.000** utilizadores ativos mensais
- ✅ **500.000** mensagens de realtime/mês
- ✅ **Autenticação** ilimitada

**Suficiente para milhares de jogadores!** 🚀

---

## 🎯 Próximos Passos

Após configurar o Supabase:

1. ✅ Testar autenticação (login/registo)
2. ✅ Verificar se o progresso é guardado
3. ✅ Testar chat em tempo real
4. ✅ Verificar leaderboard global
5. ✅ Testar multiplayer (posições em tempo real)

---

## 📞 Suporte

- [Documentação Supabase](https://supabase.com/docs)
- [Discord Supabase](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

---

**Boa sorte! 🚀**
