import { ChildrenProps as Props } from '@utils/global-interface';
import { createContext, useState } from 'react';

const authContext = createContext(null);
const { Provider } = authContext;

export default function AuthProvider({ children }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
}
