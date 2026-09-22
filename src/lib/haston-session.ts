export type SessionUser = {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
};

const USER_KEY = "haston_session_user";
const SESSION_EVENT = "haston-session-change";

export const getSessionUser = (): SessionUser | null => {
  try {
    const value = window.localStorage.getItem(USER_KEY);
    return value ? (JSON.parse(value) as SessionUser) : null;
  } catch {
    return null;
  }
};
export const saveSession = (user: SessionUser) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(SESSION_EVENT));
};
export const clearSession = () => {
  window.localStorage.removeItem(USER_KEY);
  for (const key of Object.keys(window.sessionStorage)) {
    if (/auth|session/i.test(key)) window.sessionStorage.removeItem(key);
  }
  window.dispatchEvent(new Event(SESSION_EVENT));
};
export const sessionEvent = SESSION_EVENT;
