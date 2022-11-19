import { useAuth } from '@context/auth';
import { login } from '@services/api/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { FormEventHandler } from 'react';
import { useEffect } from 'react';

export default function Login() {
  const { isAuthenticated, setUserAuth } = useAuth();
  const router = useRouter();
  const {
    mutate: loginMutate,
    // isLoading: loginIsLoading,
    // isError: loginIsError,
  } = useMutation(login, {
    onSuccess: (data) => setUserAuth(data.data),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const formSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    loginMutate({ username: 'jerick', password: 'password' });
  };
  return (
    <div>
      <form onSubmit={formSubmit}>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

/*
TODO:
1. router push to private routes when authenticated
2. inputs and form components
*/
