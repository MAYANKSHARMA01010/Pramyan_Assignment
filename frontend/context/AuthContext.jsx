'use client';
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';
import { authReducer, initialAuthState, AUTH_ACTIONS } from '@/reducers/authReducer';

const AuthContext = createContext(null);

const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const router = useRouter();
  const pathname = usePathname();

  const isLoggedIn = Boolean(state.token && state.user);
  const isLogin = isLoggedIn;
  const isAuthenticated = isLoggedIn;

  // Initialize session on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('accessToken') || getCookie('accessToken');
      const storedUser = localStorage.getItem('hr_user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (storedToken && user) {
        // Ensure cookie is synced for Next.js proxy middleware (HTTP & HTTPS safe)
        const secureFlag = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `accessToken=${storedToken}; path=/; max-age=900; SameSite=Lax${secureFlag}`;

        dispatch({
          type: AUTH_ACTIONS.INIT_AUTH,
          payload: { token: storedToken, user },
        });
      } else {
        // Clean any stale state
        localStorage.removeItem('accessToken');
        localStorage.removeItem('hr_token');
        localStorage.removeItem('hr_user');
        dispatch({
          type: AUTH_ACTIONS.INIT_AUTH,
          payload: { token: null, user: null },
        });
      }
    } catch {
      dispatch({
        type: AUTH_ACTIONS.INIT_AUTH,
        payload: { token: null, user: null },
      });
    }
  }, []);

  // Login handler
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const token = data.accessToken || data.token;
      const user = data.user;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('hr_token', token);
      localStorage.setItem('hr_user', JSON.stringify(user));

      const secureFlag = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `accessToken=${token}; path=/; max-age=900; SameSite=Lax${secureFlag}`;
      document.cookie = `hr_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax${secureFlag}`;

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { token, user },
      });

      router.replace('/dashboard');
      return { success: true };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Invalid credentials. Please verify your email and password.';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: msg,
      });
      return { success: false, error: msg };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}

    localStorage.removeItem('accessToken');
    localStorage.removeItem('hr_token');
    localStorage.removeItem('hr_user');

    document.cookie = 'accessToken=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'hr_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refreshToken=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    router.replace('/login');
  };

  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isLoggedIn,
        isLogin,
        isAuthenticated,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
