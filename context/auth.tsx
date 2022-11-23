import { setCookies } from '@services/api/auth';
import { useQuery } from '@tanstack/react-query';
import { ChildrenProps as Props } from '@utils/interface/global-interface';
import { createContext, useContext, useMemo } from 'react';

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
  const { data: userAuth, isLoading } = useQuery({
    queryKey: ['cookie'],
    queryFn: setCookies,
  });

  const isAuthenticated = useMemo(() => userAuth !== null, [userAuth]);

  return (
    <Provider value={{ userAuth, isAuthenticated, isLoading }}>
      {children}
    </Provider>
  );
}
