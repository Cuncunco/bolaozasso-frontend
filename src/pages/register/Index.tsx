import { useContext, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }

    try {
      setIsLoading(true);
      await signUp({ name: name.trim(), email: email.trim(), password: password.trim() });
      navigate("/pools", { replace: true });
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Não foi possível criar a conta";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .auth-page {
          min-height: 100vh;
          background: #06060b;
          background-image: radial-gradient(circle at 50% 30%, rgba(247,221,67,0.06) 0%, transparent 60%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .auth-card {
          width: 100%;
          max-width: 440px;
          background: #0e0e18;
          border: 1px solid rgba(247,221,67,0.18);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 0 40px rgba(247,221,67,0.06), 0 24px 64px rgba(0,0,0,0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .auth-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid rgba(247,221,67,0.14);
          background: #0a0a14;
          color: #fff;
          font-size: 15px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-input:focus {
          border-color: rgba(247,221,67,0.5);
          box-shadow: 0 0 0 3px rgba(247,221,67,0.08);
        }
        .auth-input::placeholder { color: #3a3a50; }
        .auth-btn-primary {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: #F7DD43;
          color: #06060b;
          font-weight: 800;
          font-size: 15px;
          font-family: inherit;
          cursor: pointer;
          letter-spacing: 0.05em;
          box-shadow: 0 0 20px rgba(247,221,67,0.25);
          transition: opacity 0.2s, box-shadow 0.2s;
        }
        .auth-btn-primary:hover:not(:disabled) { box-shadow: 0 0 32px rgba(247,221,67,0.45); }
        .auth-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-btn-secondary {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid rgba(247,221,67,0.18);
          background: transparent;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          font-family: inherit;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          display: block;
          letter-spacing: 0.04em;
          transition: border-color 0.2s, background 0.2s;
        }
        .auth-btn-secondary:hover {
          border-color: rgba(247,221,67,0.4);
          background: rgba(247,221,67,0.05);
        }
        @media (max-width: 480px) {
          .auth-card { padding: 28px 20px; border-radius: 14px; }
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-card">
          <img src="/logo.svg" alt="Bolãozasso" style={{ width: 200, marginBottom: 24 }} />

          <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 800, marginBottom: 6, textAlign: "center" }}>
            Criar conta
          </h1>
          <p style={{ color: "#4a5060", marginBottom: 28, textAlign: "center", fontSize: 14 }}>
            Crie sua conta para entrar nos bolões.
          </p>

          <form onSubmit={handleRegister} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              className="auth-input"
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="auth-input"
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="auth-input"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" disabled={isLoading} className="auth-btn-primary" style={{ marginTop: 4 }}>
              {isLoading ? "Criando..." : "CRIAR CONTA"}
            </button>

            <Link to="/login" className="auth-btn-secondary">
              JÁ TENHO CONTA
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}
