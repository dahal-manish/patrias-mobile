import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import type { User, Session } from "@supabase/supabase-js";
import { getSupabaseClient } from "../lib/supabase";

// Storage key for the Supabase session in SecureStore
const SUPABASE_SESSION_KEY = "supabase_session";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string) => Promise<{ 
    error: any; 
    needsEmailConfirmation?: boolean;
    user?: User | null;
  }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);

  const supabase = getSupabaseClient();

  // Load session from SecureStore on app start
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Try to load session from SecureStore
        const storedSession = await SecureStore.getItemAsync(SUPABASE_SESSION_KEY);

        if (storedSession) {
          try {
            const parsedSession = JSON.parse(storedSession) as Session;
            // Restore the session in Supabase
            const { data, error } = await supabase.auth.setSession({
              access_token: parsedSession.access_token,
              refresh_token: parsedSession.refresh_token,
            });

            if (!isMounted) return;

            if (error) {
              console.error("AuthProvider: Error restoring session:", error);
              // Clear invalid session from storage
              await SecureStore.deleteItemAsync(SUPABASE_SESSION_KEY);
              setSession(null);
              setUser(null);
            } else if (data.session) {
              setSession(data.session);
              setUser(data.session.user);
            }
          } catch (parseError) {
            console.error("AuthProvider: Error parsing stored session:", parseError);
            // Clear corrupted session from storage
            await SecureStore.deleteItemAsync(SUPABASE_SESSION_KEY);
            setSession(null);
            setUser(null);
          }
        }

        // Get current user to verify session is valid
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!isMounted) return;

        if (currentUser && !user) {
          // Session is valid but we didn't set it above, fetch it
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (currentSession) {
            setSession(currentSession);
            setUser(currentUser);
            // Save to SecureStore
            await SecureStore.setItemAsync(
              SUPABASE_SESSION_KEY,
              JSON.stringify(currentSession)
            );
          }
        } else if (!currentUser) {
          setUser(null);
          setSession(null);
        }
      } catch (err) {
        console.error("AuthProvider: Error during initialization:", err);
        setSession(null);
        setUser(null);
      } finally {
        if (isMounted) {
          setInitializing(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Subscribe to auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event);

      if (newSession?.user) {
        setSession(newSession);
        setUser(newSession.user);
        // Save session to SecureStore
        try {
          await SecureStore.setItemAsync(
            SUPABASE_SESSION_KEY,
            JSON.stringify(newSession)
          );
        } catch (error) {
          console.error("AuthProvider: Error saving session to SecureStore:", error);
        }
      } else {
        setSession(null);
        setUser(null);
        // Clear session from SecureStore
        try {
          await SecureStore.deleteItemAsync(SUPABASE_SESSION_KEY);
        } catch (error) {
          console.error("AuthProvider: Error clearing session from SecureStore:", error);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.session) {
        // Session is automatically saved via onAuthStateChange
        // but we can also save it here for immediate persistence
        try {
          await SecureStore.setItemAsync(
            SUPABASE_SESSION_KEY,
            JSON.stringify(data.session)
          );
        } catch (storeError) {
          console.error("AuthProvider: Error saving session after login:", storeError);
        }
      }

      return { error: null };
    } catch (err) {
      console.error("AuthProvider: Login error:", err);
      return { error: err };
    }
  };

  // Signup with email and password
  const signup = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          // For mobile, we can't use a web redirect URL
          // Email confirmation will be handled via the email link
          // If email confirmation is disabled in Supabase, session will be returned immediately
        },
      });

      if (error) {
        return { error };
      }

      // Check if user needs email confirmation
      const needsConfirmation = !!(data.user && !data.user.email_confirmed_at && !data.session);

      // If session is returned (email confirmation disabled or already confirmed), save it
      if (data.session) {
        try {
          await SecureStore.setItemAsync(
            SUPABASE_SESSION_KEY,
            JSON.stringify(data.session)
          );
        } catch (storeError) {
          console.error("AuthProvider: Error saving session after signup:", storeError);
        }
      }

      return { 
        error: null,
        needsEmailConfirmation: needsConfirmation || undefined,
        user: data.user || undefined,
      };
    } catch (err) {
      console.error("AuthProvider: Signup error:", err);
      return { error: err };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Session clearing is handled by onAuthStateChange
      // but we can also clear SecureStore here for immediate effect
      try {
        await SecureStore.deleteItemAsync(SUPABASE_SESSION_KEY);
      } catch (storeError) {
        console.error("AuthProvider: Error clearing session after logout:", storeError);
      }
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error("AuthProvider: Logout error:", err);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    initializing,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

