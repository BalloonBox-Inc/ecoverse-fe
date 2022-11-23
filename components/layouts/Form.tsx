import { ChildrenProps } from '@utils/interface/global-interface';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface Props extends ChildrenProps {
  submitCallback: SubmitHandler<FieldValues>;
  formClass?: string;
}

export default function Form({ children, submitCallback, formClass }: Props) {
  const methods = useForm();
  const onSubmit = methods.handleSubmit(submitCallback);

  return (
    <FormProvider {...methods}>
      <form className={twMerge(styles.form, formClass)} onSubmit={onSubmit}>
        {children}
      </form>
    </FormProvider>
  );
}

Form.defaultProps = {
  formClass: '',
};

const styles = {
  form: 'flex flex-col gap-4',
};
