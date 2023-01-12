import masterLogoWhite from '@assets/images/master-logo-white.svg';
import ErrorText from '@components/layouts/ErrorText';
import Form from '@components/layouts/Form';
import { useAuth } from '@context/auth';
import { RegisterParams } from '@services/api/auth';
import { login, register } from '@services/api/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { properCase } from '@utils/helper';
import { ChildrenProps } from '@utils/interface/global-interface';
import { AxiosError } from 'axios';
import Image from 'next/image';
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
              : err.response?.data.message ?? err.message
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
      <div className={styles.backgroundImage}>
        {' '}
        <Link href={'/'} passHref className="cursor-pointer">
          <Image
            className={styles.logo}
            src={masterLogoWhite}
            alt="master-logo"
            width={150}
          />
        </Link>
      </div>
      <div className={styles.formContainer}>
        <Link href={'/'} passHref className="cursor-pointer">
          <Image
            className={styles.mobileLogo}
            src={masterLogoWhite}
            alt="master-logo"
            width={200}
          />
        </Link>
        <Form submitCallback={onSubmit} formClass={styles.formClass}>
          <h1>{onboard === 'login' ? 'Log In' : 'Sign Up'}</h1>
          <>{children}</>
          <div className={styles.alternative}>
            <p>{onboardQuery[onboard].alternateMessage}</p>
            <Link className={styles.onboard} href={`/${alternate}`}>
              {properCase(alternate)} now
            </Link>
          </div>
          <ErrorText
            message={submissionError}
            messageClass={styles.messageClass}
          />

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
          </div>
        </Form>
      </div>
    </div>
  );
}

const styles = {
  root: 'w-full flex items-center h-screen font-figtree bg-primary bg-auth bg-cover lg:bg-white lg:bg-none ',
  backgroundImage: `w-0 lg:visible invisible lg:w-1/2 h-screen bg-auth bg-cover brightness-40`,
  logo: 'absolute top-1 m-10',
  mobileLogo: 'visible lg:invisible',
  formContainer:
    'w-full lg:w-1/2 flex flex-col w-full justify-center items-center',
  formClass: `w-full bg-white max-w-xl px-8 pt-10 pb-20 mx-auto items-start mt-nav`,
  messageClass: 'text-center',
  cta: 'w-full flex flex-col items-center md:items-end gap-4',
  buttonContainer: 'flex flex-col w-full gap-4 mt-8 md:flex-row md:justify-end',
  alternative: 'flex gap-2 md:justify-end',
  button:
    'btn btn-primary py-2 cursor-pointer order-1 capitalize md:order-2 active:scale-95 hover:text-inherit',
  buttonBack: 'btn-outline btn-accent order-2 md:order-1',
  onboard: 'text-primary hover:text-primary',
};
