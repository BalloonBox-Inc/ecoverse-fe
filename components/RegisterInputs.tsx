import InputForm, { FormProps } from '@components/layouts/InputForm';
import { useFormContext } from 'react-hook-form';

export default function RegisterInputs() {
  const { watch } = useFormContext();
  const inputFields = [
    {
      id: 'email',
      placeholder: 'password',
      type: 'text',
      validationOptions: { required: 'Email required' },
    },
    {
      id: 'password',
      placeholder: 'password',
      type: 'password',
      validationOptions: { required: 'Password required' },
    },
    {
      id: 'confirm password',
      placeholder: 'confirm password',
      type: 'password',
      validationOptions: {
        required: 'Confirm Password required',
        validate: (value: unknown) =>
          (value as string) === watch('password') || "Password doesn't match",
      },
    },
  ];
  return (
    <>
      {inputFields.map((inputProp: FormProps) => {
        return <InputForm key={inputProp.id} {...inputProp} />;
      })}
    </>
  );
}
