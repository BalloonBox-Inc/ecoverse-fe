import ErrorText from '@components/layouts/ErrorText';
import Form from '@components/layouts/Form';
import LoginInputs from '@components/LoginInputs';
import { useAuth } from '@context/auth';
import { login } from '@services/api/auth';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

interface LoginAttribute {
  email: string;
  password: string;
}

export default function Login() {
  const [submissionError, setSubmissionError] = useState<string>('');
  const { isAuthenticated, setUserAuth } = useAuth();
  const router = useRouter();
  const { mutate: loginMutate, isLoading: loginIsLoading } = useMutation(
    login,
    {
      onSuccess: (data) => setUserAuth(data.data),
      onError: (err) => {
        if (err instanceof AxiosError) {
          return setSubmissionError(
            err.response?.data.message || 'Server Error'
          );
        }
        setSubmissionError('Unknown Error');
      },
    }
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const onSubmit = (data: unknown) => {
    loginMutate(data as LoginAttribute);
  };
  const handleBack = () => router.push('/');

  return (
    <div>
      <Form submitCallback={onSubmit}>
        <ErrorText
          message={submissionError}
          messageClass={styles.messageClass}
        />

        <LoginInputs />

        <div className={styles.buttonContainer}>
          <input
            className={twMerge(styles.button, styles.buttonBack)}
            type="button"
            value="Cancel"
            onClick={handleBack}
            disabled={loginIsLoading}
          />
          <input
            className={twMerge(styles.button)}
            type="submit"
            value="Login"
            disabled={loginIsLoading}
          />
        </div>
        <div className={styles.registerContainer}>
          <p>Don&apos;t have an account?</p>
          <Link className={styles.register} href="/register">
            Register Now!
          </Link>
        </div>
      </Form>
    </div>
  );
}

const styles = {
  buttonContainer: 'flex justify-end gap-4',
  registerContainer: 'flex justify-end gap-2',
  register: 'text-primary hover:text-primary/80',
  button:
    'bg-primary py-2 px-4 w-20 rounded-md cursor-pointer hover:opacity-80 active:scale-95',
  buttonBack: 'bg-transparent border-2 border-secondary',
  messageClass: 'text-center',
};
