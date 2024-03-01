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
type profile = "USER" | "ADMIN" | "SUPER_ADMIN";

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
  getAdminFunctionId?: number;
}

export const Context = createContext<ContextState>({
  session: null,
  signUp,
  logIn,
  doSignOut,
});
function AppContextProvider({ children }: props) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<profile>("USER");
  const [isLoading, setLoading] = useState(false);
  const [failProfile, setfailProfile] = useState(false);
  const [adminFunction, setAdminFunction] = useState<number | null>();
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
    if (userSession == null) {
      setSession(null);
      setLoading(false);
      return;
    } else {
      const { data, error: failFecthing } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userSession.user.id)
        .eq("role", "SUPER_ADMIN")
        .single();
      if (data && failFecthing == null) {
        setLoading(false);
        setSession(userSession);
        setProfile("SUPER_ADMIN");
      }
    }
    await supabase
      .from("admin")
      .select("*")
      .eq("uuid", userSession.user.id)
      .single()
      .then((v) => {
        if (v.data) {
          setLoading(false);
          setSession(userSession);
          setAdminFunction(v.data.fonction);
          setProfile("ADMIN");
        }
      });
    /*.then((v) => {
        if (v.error) {
          setSession(null);
          setLoading(false);
          return;
        } else {
          if (v.data && v.data.role === "SUPER_ADMIN") {
            console.log("log as an admin");
            setSession(userSession);
            setProfile("SUPER_ADMIN");
            console.log(session);
          } else {
            
              .then((v) => {
                if (v.data) {
                  setSession(userSession);
                  setProfile("ADMIN");
                }
                if (v.error) {
                  setSession(null);
                  console.log(v.error.message);
                  setLoading(false);
                  return;
                }
              });
          }
        }
      });*/
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
    getAdminFunctionId: adminFunction!,
  };
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
export const useAuth = () => useContext(Context);
export default AppContextProvider;

/**

    
    
      console.log(fetchList);
  }
    
   
    

  }

 */
