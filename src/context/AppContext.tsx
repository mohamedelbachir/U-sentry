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
}

export const Context = createContext<ContextState>({
  session: null,
  signUp,
  logIn,
  doSignOut,
});
function AppContextProvider({ children }: props) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<profile>("SUPER_ADMIN"); //test Case
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      handleUserRole(data.session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      handleUserRole(session);
    });
  }, []);
  async function handleUserRole(userSession: Session | null) {
    if (userSession === null) {
      setSession(null);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userSession.user.id)
      .single();
    if (error) {
      setSession(null);
      console.log(error.message);
      return;
    }
    if (data) {
      if (data.role === "ETUDIANT") {
        setSession(null);
        throw new Error("fail to connect");
        return;
      }
      setProfile(data.role as profile);
    }
    setSession(userSession);
  }
  const contextValue: ContextState = {
    session,
    signUp,
    logIn,
    doSignOut,
    setSession: setSession,
    isAdmin: profile === "ADMIN",
    isSuperAdmin: profile === "SUPER_ADMIN",
  };
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
export const useAuth = () => useContext(Context);
export default AppContextProvider;
