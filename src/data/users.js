import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

export function useUsers(token) {
  const [result, setResult] = useState(() => ({
    token,
    users: [],
    loading: Boolean(token),
    error: "",
  }));

  useEffect(() => {
    let active = true;

    if (!token) return;

    api.getAccounts(token)
      .then(({ accounts }) => {
        if (active) {
          setResult({ token, users: accounts, loading: false, error: "" });
        }
      })
      .catch((requestError) => {
        if (active) {
          setResult({ token, users: [], loading: false, error: requestError.message });
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  const deleteUser = useCallback(async (userId) => {
    await api.deleteAccount(userId, token);
    setResult((current) => current.token === token
      ? { ...current, users: current.users.filter((user) => user.id !== userId) }
      : current);
  }, [token]);

  const currentResult = result.token === token
    ? result
    : { users: [], loading: Boolean(token), error: "" };

  return { ...currentResult, deleteUser };
}
