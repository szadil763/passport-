import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authErrorMessage } from '../data/authErrors';
import { IconGoogle, Logo } from '../components/Icons';

export default function Login() {
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' ou 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const isSignup = mode === 'signup';

  async function run(action) {
    setError('');
    setBusy(true);
    try {
      await action();
    } catch (e) {
      setError(authErrorMessage(e));
      setBusy(false);
    }
  }

  function handleEmail(event) {
    event.preventDefault();
    run(() => (isSignup ? signupWithEmail(email, password) : loginWithEmail(email, password)));
  }

  function switchMode() {
    setMode(isSignup ? 'login' : 'signup');
    setError('');
  }

  return (
    <main className="login">
      <div className="login-hero">
        <Logo />
        <h1>Seu passaporte começa aqui.</h1>
        <p className="muted">
          Escolha um destino, encontre bolsas e cursos de idioma e siga um passo a passo até o embarque.
        </p>
      </div>

      <div className="card login-card">
        <button className="btn" type="button" onClick={() => run(loginWithGoogle)} disabled={busy}>
          <IconGoogle />
          Entrar com Google
        </button>

        <p className="divider">ou use seu e-mail</p>

        <form onSubmit={handleEmail} className="stack">
          <h2 className="sr-only">{isSignup ? 'Criar conta com e-mail' : 'Entrar com e-mail'}</h2>
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              inputMode="email"
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              aria-describedby={isSignup ? 'senha-dica' : undefined}
            />
          </label>
          {isSignup && (
            <p id="senha-dica" className="hint">Use pelo menos 6 caracteres.</p>
          )}

          <div aria-live="polite">{error && <p className="error" role="alert">{error}</p>}</div>

          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? 'Aguarde…' : isSignup ? 'Criar conta' : 'Entrar'}
          </button>
        </form>

        <button className="link-button" type="button" onClick={switchMode}>
          {isSignup ? 'Já tem conta? Entrar' : 'Ainda não tem conta? Criar conta'}
        </button>
      </div>
    </main>
  );
}
