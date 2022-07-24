import { createContext, useState } from "react";

interface IAuth {
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}

export const AuthContext = createContext<IAuth>({
  authenticated: true,
  setAuthenticated: (value: boolean) => {},
});

interface IProps {
  children?: React.ReactNode;
}

export const AuthContextProvider = ({ children }: IProps) => {
  const [authenticated, setAuthenticated] = useState(true);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
