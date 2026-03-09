import { createContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../services/Api";
import { getToken, removeToken, setToken } from "../utils/Storage";

type User = {
  id: string;
  name?: string | null;
  email: string;
  avatarUrl?: string | null;
};

type SignInData = {
  email: string;
  password: string;
};

type SignUpData = {
  name: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (data: SignInData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext({} as AuthContextType);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromStorage() {
      try {
        const storedToken = getToken();

        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        setTokenState(storedToken);
        api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;

        const response = await api.get("/me");
        setUser(response.data.user);
      } catch {
        removeToken();
        setTokenState(null);
        setUser(null);
        delete api.defaults.headers.common.Authorization;
      } finally {
        setIsLoading(false);
      }
    }

    loadUserFromStorage();
  }, []);

  async function signIn({ email, password }: SignInData) {
    const response = await api.post("/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    setToken(token);
    setTokenState(token);
    setUser(user);

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  async function signUp({ name, email, password }: SignUpData) {
    const response = await api.post("/register", {
      name,
      email,
      password,
    });

    const { token, user } = response.data;

    setToken(token);
    setTokenState(token);
    setUser(user);

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  function signOut() {
    removeToken();
    setTokenState(null);
    setUser(null);
    delete api.defaults.headers.common.Authorization;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}