import Form from '@components/layouts/Form';
import RegisterInputs from '@components/RegisterInputs';
import { useAuth } from '@context/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Register() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const onSubmit = (data: unknown) => {
    console.log(data);
  };

  const handleBack = () => router.push('/');

  return (
    <div>
      <Form submitCallback={onSubmit}>
        <RegisterInputs />

        <div className={styles.buttonContainer}>
          <input
            className={twMerge(styles.button, styles.buttonBack)}
            type="button"
            value="Cancel"
            onClick={handleBack}
          />
          <input
            className={twMerge(styles.button)}
            type="submit"
            value="Register"
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
1. Need validate confirm password

*/
