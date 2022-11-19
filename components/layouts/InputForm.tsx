import ErrorText from '@components/layouts/ErrorText';
import { ErrorMessage } from '@hookform/error-message';
import { HTMLInputTypeAttribute } from 'react';
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
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={twMerge(styles.root, outerClass)}>
      <div className={styles.labelDiv}>
        <label className={twMerge(styles.label, labelClass)} htmlFor={id}>
          {id}
        </label>
        <ErrorMessage
          errors={errors}
          name={id}
          render={({ message }) => (
            <ErrorText message={message} messageClass={messageClass} />
          )}
        />
      </div>

      <input
        id={id}
        type={type}
        className={twMerge(styles.input, inputClass)}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete="false"
        {...register(id, validationOptions)}
      />
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
  root: 'flex flex-col gap-2',
  labelDiv: 'flex justify-between',
  label: 'capitalize',
  input: 'placeholder:capitalize py-1 px-2 text-neutral',
};
