import InputForm, { FormProps } from '@components/layouts/InputForm';

export default function LoginInputs() {
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
  ];

  return (
    <>
      {inputFields.map((inputProp: FormProps) => {
        return <InputForm key={inputProp.id} {...inputProp} />;
      })}
    </>
  );
}
