import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { AuthError, Session } from "@supabase/supabase-js";

type props = {
  children?: React.ReactNode;
};

interface userAuthLoginType {
  email: string;
  password: string;
}
type profile = "ETUDIANT" | "ADMIN" | "SUPER_ADMIN";

interface userAuthSignUpType extends userAuthLoginType {}

async function logIn(data: userAuthLoginType) {
  const result = await supabase.auth.signInWithPassword(data);
  if (!result.error) {
    return true;
  }
  return false;
}

async function doSignOut() {
  return await supabase.auth.signOut();
}

async function signUp(data: userAuthSignUpType) {
  console.log(data);
  return await supabase.auth
    .signUp({
      email: data.email,
      password: data.password,
    })
    .then((a) => {
      return a.data.session;
    })
    .catch((e) => {
      console.log(e);
      return null;
    });
}
export interface ContextState {
  session: Session | null;
  setSession?: (d: Session) => void;
  signUp: (data: userAuthSignUpType) => Promise<Session | null>;
  logIn: (data: userAuthLoginType) => Promise<boolean>;
  doSignOut?: () => Promise<{ error: AuthError | null }>;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  isLoading?: boolean;
  failUser?: boolean;
}

export const Context = createContext<ContextState>({
  session: null,
  signUp,
  logIn,
  doSignOut,
});
function AppContextProvider({ children }: props) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<profile>("ETUDIANT");
  const [isLoading, setLoading] = useState(false);
  const [failProfile, setfailProfile] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoading(true);
      handleUserRole(data.session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true);
      handleUserRole(session);
    });
  }, []);
  async function handleUserRole(userSession: Session | null) {
    if (userSession === null) {
      setSession(null);
      setLoading(false);
      return;
    }
    const { data: adminData, error: fetchingError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userSession.user.id)
      .eq("role", "SUPER_ADMIN")
      .single();
    if (fetchingError) {
      setSession(null);
      setLoading(false);
      return;
    }
    if (adminData != null) {
      setProfile("SUPER_ADMIN");
      setLoading(false);
    } else {
      const { data, error } = await supabase
        .from("admin")
        .select("*")
        .eq("uuid", userSession.user.id)
        .single();
      if (error) {
        setSession(null);
        console.log(error.message);
        setLoading(false);
        return;
      }
      if (data === null) {
        setSession(null);
        setLoading(false);
        setfailProfile(true);
        throw new Error("fail to connect");
        return;
      } else {
        setProfile("ADMIN");
      }
    }
    setSession(userSession);
    setLoading(false);
  }
  const contextValue: ContextState = {
    session,
    signUp,
    logIn,
    doSignOut,
    setSession: setSession,
    isAdmin: profile === "ADMIN",
    isSuperAdmin: profile === "SUPER_ADMIN",
    isLoading: isLoading,
    failUser: failProfile,
  };
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
export const useAuth = () => useContext(Context);
export default AppContextProvider;
