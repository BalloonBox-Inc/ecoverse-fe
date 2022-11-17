import { ChildrenProps as Props } from '@utils/global-interface';
import { createContext, useContext, useState } from 'react';

interface AuthContext {
  isAuthenticated: boolean;
  setIsAuthenticated: Function;
}

const INIT_AUTH: AuthContext = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
};

const authContext = createContext<AuthContext>(INIT_AUTH);
const { Provider } = authContext;

export const useAuth: () => AuthContext = () => {
  return useContext(authContext);
};

export default function AuthProvider({ children }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </Provider>
  );
}
