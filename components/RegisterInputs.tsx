import InputForm, { FormProps } from '@components/layouts/InputForm';
import { useFormContext } from 'react-hook-form';

export default function RegisterInputs() {
  const { watch } = useFormContext();
  const inputFields = [
    {
      id: 'username',
      placeholder: 'username',
      type: 'text',
      validationOptions: { required: 'Username required' },
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
