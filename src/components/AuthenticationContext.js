/* eslint-disable react/react-in-jsx-scope */
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// eslint-disable-next-line react/prop-types
const AuthenticationContext = ({ children }) => {
  const { authUser, loading } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!loading && !authUser) history.push("/auth");
    else if (!loading && authUser) history.push("/admin");
  }, [authUser, loading]);

  return <>{children}</>;
};

export default AuthenticationContext;
