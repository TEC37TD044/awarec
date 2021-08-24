import { createContext, useContext } from "react";
import useFirebaseAuth from "./useFirebaseAuth";

const authUserContext = createContext({
  authUser: null,
  loading: true,
  signInWithEmailAndPassword: async () => {},
  createUserWithEmailAndPassword: async () => {},
  signOut: async () => {},
});

// eslint-disable-next-line react/prop-types
export function AuthUserProvider({ children }) {
  const auth = useFirebaseAuth();
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>
  );
}

export const useAuth = () => useContext(authUserContext);
