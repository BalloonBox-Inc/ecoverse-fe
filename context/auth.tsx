import { setCookies } from '@services/api/auth';
import { useQuery } from '@tanstack/react-query';
import { ChildrenProps as Props } from '@utils/global-interface';
import { useEffect } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

interface UserAuth {
  user: string;
}
interface AuthContext {
  userAuth: UserAuth | null;
  setUserAuth: Function;
  isAuthenticated: boolean;
}

const INIT_AUTH: AuthContext = {
  userAuth: null,
  setUserAuth: () => {},
  isAuthenticated: false,
};

const authContext = createContext<AuthContext>(INIT_AUTH);
const { Provider } = authContext;

export const useAuth: () => AuthContext = () => {
  return useContext(authContext);
};

export default function AuthProvider({ children }: Props) {
  const [userAuth, setUserAuth] = useState<UserAuth | null>(null);

  const isAuthenticated = useMemo(() => userAuth !== null, [userAuth]);

  const { data } = useQuery({
    queryKey: ['cookie'],
    queryFn: setCookies,
  });

  useEffect(() => {
    if (data && data.user) setUserAuth(data.user);
  }, [data]);

  return (
    <Provider value={{ userAuth, setUserAuth, isAuthenticated }}>
      {children}
    </Provider>
  );
}
