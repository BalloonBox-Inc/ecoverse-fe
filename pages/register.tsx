import ErrorText from '@components/layouts/ErrorText';
import Form from '@components/layouts/Form';
import RegisterInputs from '@components/RegisterInputs';
import { useAuth } from '@context/auth';
import { register, RegisterParams } from '@services/api/auth';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Register() {
  const [submissionError, setSubmissionError] = useState<string>('');
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { mutate: registerMutate, isLoading: registerIsLoading } = useMutation(
    register,
    {
      onSuccess: () => router.push('/login'),
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
    registerMutate(data as RegisterParams);
  };

  const handleBack = () => router.push('/');

  return (
    <div>
      <Form submitCallback={onSubmit}>
        <ErrorText
          message={submissionError}
          messageClass={styles.messageClass}
        />

        <RegisterInputs />

        <div className={styles.buttonContainer}>
          <input
            className={twMerge(styles.button, styles.buttonBack)}
            type="button"
            value="Cancel"
            onClick={handleBack}
            disabled={registerIsLoading}
          />
          <input
            className={twMerge(styles.button)}
            type="submit"
            value="Register"
            disabled={registerIsLoading}
          />
        </div>

        <div className={styles.loginContainer}>
          <p>Already have an account?</p>
          <Link className={styles.register} href="/login">
            Login now!
          </Link>
        </div>
      </Form>
    </div>
  );
}

const styles = {
  buttonContainer: 'flex justify-end gap-4',
  loginContainer: 'flex justify-end gap-2',
  register: 'text-primary hover:text-primary/80',
  button:
    'bg-primary py-2 px-4 w-24 rounded-md cursor-pointer hover:opacity-80 active:scale-95',
  buttonBack: 'bg-transparent border-2 border-secondary',
  messageClass: 'text-center',
};

/*
todo:
1. Need to create component for button container for login and register page

*/
