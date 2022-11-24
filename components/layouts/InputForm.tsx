import HideIcon from '@components/Icons/HideIcon';
import ShowIcon from '@components/Icons/ShowIcon';
import ErrorText from '@components/layouts/ErrorText';
import { ErrorMessage } from '@hookform/error-message';
import { snakeToCamel } from '@utils/helper';
import { HTMLInputTypeAttribute, useState } from 'react';
import { useFormContext, Validate } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface ValidationProps {
  required: boolean | string;
  min: number;
  max: number;
  minLength: number;
  maxLength: number;
  pattern: RegExp;
  validate: Validate<any> | Record<string, Validate<any>> | undefined;
}

export interface FormProps {
  outerClass?: string;
  labelClass?: string;
  inputClass?: string;
  messageClass?: string;
  id: string;
  defaultValue?: string;
  placeholder?: string;
  validationOptions?: Partial<ValidationProps>;
  type?: HTMLInputTypeAttribute;
}

export default function InputForm({
  id,
  outerClass,
  labelClass,
  inputClass,
  messageClass,
  defaultValue,
  placeholder,
  validationOptions,
  type,
}: FormProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const label = id.replace('_', ' ');
  const name = snakeToCamel(id);
  const passButton = type === 'password';

  return (
    <div className={twMerge(styles.root, outerClass)}>
      <div className={styles.labelDiv}>
        <label className={twMerge(styles.label, labelClass)} htmlFor={id}>
          {label}
        </label>
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <ErrorText message={message} messageClass={messageClass} />
          )}
        />
      </div>

      <div className={styles.inputGroup}>
        <input
          id={id}
          type={showPassword ? 'text' : type}
          className={twMerge(
            styles.input,
            errors[name] && styles.inputError,
            inputClass
          )}
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoComplete="false"
          {...register(name, validationOptions)}
        />
        {passButton && (
          <button
            type="button"
            className={styles.button}
            onClick={handleTogglePassword}
          >
            {showPassword ? (
              <HideIcon className={styles.buttonIcon} />
            ) : (
              <ShowIcon className={styles.buttonIcon} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

InputForm.defaultProps = {
  outerClass: '',
  labelClass: '',
  inputClass: '',
  messageClass: '',
  type: 'text',
};

const styles = {
  root: 'flex flex-col gap-2 w-full',
  labelDiv: 'flex justify-between items-end',
  label: 'capitalize',
  inputGroup: 'w-full relative ',
  input: 'input input-primary placeholder:capitalize w-full',
  inputError: 'input-error',
  button:
    'btn no-animation bg-transparent border-0 absolute right-0 hover:bg-transparent',
  buttonIcon: 'fill-current h-6 w-6',
};
