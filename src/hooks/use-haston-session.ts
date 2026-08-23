import { useEffect, useState } from "react";
import { getSessionUser, sessionEvent, type SessionUser } from "@/lib/haston-session";

export const useHastonSession = () => {
  const [user, setUser] = useState<SessionUser | null>(() => getSessionUser());
  useEffect(() => {
    const sync = () => setUser(getSessionUser());
    window.addEventListener(sessionEvent, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(sessionEvent, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return user;
};
