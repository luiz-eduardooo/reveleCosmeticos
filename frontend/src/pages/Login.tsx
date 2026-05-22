import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

type ErroResponse = {
  mensagem: string;
};

type LoginResponse = {
  token: string;
  usuario: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
};

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const response = await api.post<LoginResponse>('/usuarios/login', {
        email,
        password,
      });

      const { token, usuario } = response.data;
      login(usuario, token);
      navigate('/');
    } catch (err: any) {
      const mensagem = err.response?.data?.mensagem ?? 'Erro ao fazer login';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        <button type="submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}