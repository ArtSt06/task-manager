import toast from "react-hot-toast";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

import { useAuth } from "@contexts/AuthContext";
import { getFirebaseErrorMessage } from "@utils/getFirebaseError";

import "./AuthForm.scss";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const navigate = useNavigate();

  const isLogin = mode === "sign-in";

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      toast.error("Пароли не совпадают");
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

      if (error instanceof FirebaseError) {
        message = getFirebaseErrorMessage(error.code);
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите пароль</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={loading}
              />
            </div>
          )}

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
