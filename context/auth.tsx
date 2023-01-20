import { setCookies } from '@services/api/auth';
import { useQuery } from '@tanstack/react-query';
import { ChildrenProps as Props } from '@utils/interface/global-interface';
import { createContext, useContext, useEffect, useState } from 'react';

interface UserAuth {
  user: string;
}
interface AuthContext {
  userAuth: UserAuth | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const INIT_AUTH: AuthContext = {
  userAuth: null,
  isAuthenticated: false,
  isLoading: false,
};

const authContext = createContext<AuthContext>(INIT_AUTH);
const { Provider } = authContext;

export const useAuth: () => AuthContext = () => {
  return useContext(authContext);
};

export default function AuthProvider({ children }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { data: userAuth, isLoading } = useQuery({
    queryKey: ['cookie'],
    queryFn: setCookies,
  });

  useEffect(() => {
    if (isLoading) return setIsAuthenticated(false);
    setIsAuthenticated(!!userAuth);
  }, [userAuth, isLoading]);

  return (
    <Provider value={{ userAuth, isAuthenticated, isLoading }}>
      {children}
    </Provider>
  );
}

// todo: on userAuth, query all nft's owned by owner. Have to get the wallet address too
