import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import {
  clearSessionToken,
  getSessionToken,
  saveSessionToken,
} from "../data/sessionStore";

export function useAuth({ loadAccountData, clearAccountData, clearShoppingData }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const savedToken = await getSessionToken();
        if (!savedToken) return;

        const { user: savedUser } = await api.profile(savedToken);
        if (!active) return;
        setToken(savedToken);
        setUser(savedUser);
        await loadAccountData(savedToken);
      } catch (error) {
        if (error.status === 401) {
          await clearSessionToken();
          if (active) {
            setToken(null);
            setUser(null);
          }
        } else if (active) {
          setSessionError(error.message);
        }
      } finally {
        if (active) setAuthReady(true);
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, [loadAccountData]);

  const signIn = useCallback(async (email, password) => {
    const session = await api.login(email, password);
    await saveSessionToken(session.token);
    setToken(session.token);
    setUser(session.user);
    setSessionError("");
    try {
      await loadAccountData(session.token);
    } catch (error) {
      setSessionError(error.message);
    }
    return session.user;
  }, [loadAccountData]);

  const signUp = useCallback(async (name, email, password) => {
    const session = await api.register(name, email, password);
    await saveSessionToken(session.token);
    setToken(session.token);
    setUser(session.user);
    clearAccountData();
    setSessionError("");
    return session.user;
  }, [clearAccountData]);

  const signOut = useCallback(async () => {
    const sessionToken = token;
    setToken(null);
    setUser(null);
    clearAccountData();
    clearShoppingData();

    await clearSessionToken();
    if (sessionToken) await api.logout(sessionToken);
  }, [token, clearAccountData, clearShoppingData]);

  return {
    token,
    user,
    authReady,
    sessionError,
    signIn,
    signUp,
    signOut,
  };
}
