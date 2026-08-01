import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

import { useAuth } from "@contexts/AuthContext";

import "./AuthForm.scss";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const navigate = useNavigate();

  const isLogin = mode === "sign-in";

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (!isLogin && password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate("/");
    } catch (error: unknown) {
      let message = isLogin ? "Ошибка входа" : "Ошибка регистрации";
      if (error instanceof FirebaseError || error instanceof Error) {
        message = error.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label>Подтвердите пароль</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading
              ? isLogin
                ? "Вход..."
                : "Регистрация..."
              : isLogin
                ? "Войти"
                : "Зарегистрироваться"}
          </button>
        </form>
        <p>
          {isLogin ? (
            <>
              Нет аккаунта? <Link to="/sign-up">Зарегистрироваться</Link>
            </>
          ) : (
            <>
              Уже есть аккаунт? <Link to="/sign-in">Войти</Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
