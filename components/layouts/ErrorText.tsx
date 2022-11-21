import { twMerge } from 'tailwind-merge';

interface ErrorProps {
  message: string;
  messageClass?: string;
}

export default function ErrorText({ message, messageClass }: ErrorProps) {
  return <p className={twMerge(styles.message, messageClass)}>{message}</p>;
}

ErrorText.defaultProps = {
  messsageClass: '',
};

const styles = {
  message: 'text-error italic text-sm',
};
