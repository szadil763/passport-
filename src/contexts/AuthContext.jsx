// Contexto de autenticação: guarda o usuário logado e o perfil dele (users/{uid}).
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // undefined = ainda carregando; null = sem usuário / sem perfil
  const [user, setUser] = useState(undefined);
  const [profile, setProfile] = useState(undefined);
  const [profileError, setProfileError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u ?? null)), []);

  // Acompanha o perfil em tempo real enquanto houver usuário logado.
  useEffect(() => {
    if (!user) {
      setProfile(user === null ? null : undefined);
      return undefined;
    }
    setProfile(undefined);
    setProfileError(null);
    return onSnapshot(
      doc(db, 'users', user.uid),
      (snap) => setProfile(snap.exists() ? snap.data() : null),
      (error) => {
        setProfileError(error);
        setProfile(null);
      }
    );
  }, [user]);

  // Administrador: existe um documento admins/{uid}? A regra só deixa a pessoa ler o próprio.
  useEffect(() => {
    setIsAdmin(false);
    setAdminChecked(false);
    if (!user) return undefined;
    return onSnapshot(
      doc(db, 'admins', user.uid),
      (snap) => {
        setIsAdmin(snap.exists());
        setAdminChecked(true);
      },
      () => {
        setIsAdmin(false);
        setAdminChecked(true);
      }
    );
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      profile,
      profileError,
      isAdmin,
      adminChecked,
      loading: user === undefined || (Boolean(user) && profile === undefined),

      async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
          await signInWithPopup(auth, provider);
        } catch (error) {
          // Alguns celulares bloqueiam pop-up: tenta pelo redirecionamento.
          if (error.code === 'auth/popup-blocked') return signInWithRedirect(auth, provider);
          throw error;
        }
      },
      loginWithEmail: (email, password) => signInWithEmailAndPassword(auth, email, password),
      signupWithEmail: (email, password) => createUserWithEmailAndPassword(auth, email, password),
      resetPassword: (email) => sendPasswordResetEmail(auth, email),
      logout: () => signOut(auth),

      // Grava só os campos enviados, sem apagar os outros (merge).
      saveProfile: (data) =>
        setDoc(doc(db, 'users', user.uid), { ...data, updatedAt: serverTimestamp() }, { merge: true }),
    }),
    [user, profile, profileError, isAdmin, adminChecked]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
