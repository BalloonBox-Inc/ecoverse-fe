import ErrorText from '@components/layouts/ErrorText';
import Form from '@components/layouts/Form';
import LoginInputs from '@components/LoginInputs';
import { useAuth } from '@context/auth';
import { login, LoginParams } from '@services/api/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Login() {
  const [submissionError, setSubmissionError] = useState<string>('');

  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: loginMutate, isLoading: loginIsLoading } = useMutation(
    login,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cookie'] });
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          return setSubmissionError(
            err.response?.status && err.response?.status >= 500
              ? 'Server Error'
              : err.response?.data.message
          );
        }
        setSubmissionError('Unknown Error');
      },
    }
  );

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/profile');
    }
  }, [isAuthenticated, router, isLoading]);

  const onSubmit = (data: unknown) => {
    loginMutate(data as LoginParams);
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
