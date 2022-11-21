import ErrorText from '@components/layouts/ErrorText';
import Form from '@components/layouts/Form';
import { useAuth } from '@context/auth';
import { RegisterParams } from '@services/api/auth';
import { login, register } from '@services/api/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChildrenProps } from '@utils/global-interface';
import { properCase } from '@utils/helper';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends ChildrenProps {
  onboard: keyof typeof onboardQuery;
}

const onboardQuery = {
  login: {
    query: login,
    alternate: 'register',
  },
  register: {
    query: register,
    alternate: 'login',
  },
};

export default function OnboardContainer({ onboard, children }: Props) {
  const [submissionError, setSubmissionError] = useState<string>('');
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isLoading: onboardLoading } = useMutation(
    onboardQuery[onboard].query,
    {
      onSuccess: () => {
        if (onboard === 'register') {
          return router.push('/login');
        }
        if (onboard === 'login') {
          return queryClient.invalidateQueries({ queryKey: ['cookie'] });
        }
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

  const alternate = onboardQuery[onboard].alternate;

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/profile');
    }
  }, [isAuthenticated, router, isLoading]);

  const onSubmit = (data: unknown) => {
    mutate(data as RegisterParams);
  };

  const handleBack = () => router.push('/');

  return (
    <div className={styles.root}>
      <Form submitCallback={onSubmit}>
        <ErrorText
          message={submissionError}
          messageClass={styles.messageClass}
        />

        <>{children}</>

        <div className={styles.buttonContainer}>
          <input
            className={twMerge(styles.button, styles.buttonBack)}
            type="button"
            value="Cancel"
            onClick={handleBack}
            disabled={onboardLoading}
          />
          <input
            className={twMerge(styles.button)}
            type="submit"
            value={onboard}
            disabled={onboardLoading}
          />
        </div>
        <div className={styles.alternative}>
          <p>Already have an account?</p>
          <Link className={styles.onboard} href={`/${alternate}`}>
            {properCase(alternate)} now!
          </Link>
        </div>
      </Form>
    </div>
  );
}

const styles = {
  root: 'container',
  messageClass: 'text-center',
  buttonContainer: 'flex justify-end gap-4 mt-8',
  alternative: 'flex justify-end gap-2',
  button:
    'bg-primary py-2 w-24 rounded-md cursor-pointer hover:opacity-80 active:scale-95 capitalize',
  buttonBack: 'bg-transparent border-2 border-secondary',
  onboard: 'text-primary hover:text-primary/80',
};
