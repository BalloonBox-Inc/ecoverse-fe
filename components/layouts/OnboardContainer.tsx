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
    alternateMessage: "Dont't have an account?",
  },
  register: {
    query: register,
    alternate: 'login',
    alternateMessage: 'Already have an account?',
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
      <Form submitCallback={onSubmit} formClass={styles.formClass}>
        <div className={styles.logo}>Ecoverse</div>
        {/* logo on here */}
        <ErrorText
          message={submissionError}
          messageClass={styles.messageClass}
        />

        <>{children}</>

        <div className={styles.cta}>
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
            <p>{onboardQuery[onboard].alternateMessage}</p>
            <Link className={styles.onboard} href={`/${alternate}`}>
              {properCase(alternate)} now!
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
}

const styles = {
  root: 'container items-center ',
  logo: '',
  formClass:
    'max-w-xl card shadow-xl bg-black/20 px-8 pt-10 pb-20 mx-auto items-center mt-16',
  messageClass: 'text-center',
  cta: 'w-full flex flex-col items-center md:items-end gap-4',
  buttonContainer: 'flex flex-col w-full gap-4 mt-8 md:flex-row md:justify-end',
  alternative: 'flex gap-2 md:justify-end',
  button:
    'bg-primary py-2 w-full rounded-md cursor-pointer order-1 md:order-2 md:w-24 hover:opacity-80 active:scale-95 capitalize',
  buttonBack: 'bg-transparent border-2 border-secondary order-2 md:order-1',
  onboard: 'text-primary hover:text-primary/80',
};
