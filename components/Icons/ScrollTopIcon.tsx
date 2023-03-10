import Icon from '@components/layouts/Icon';
import { ClassNameProps } from '@utils/interface/global-interface';

export default function ScrollTopIcon({ className }: ClassNameProps) {
  return (
    <Icon className={className} viewBox="0 0 48 48">
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M22.5 40V13.7L10.1 26.1 8 24 24 8l16 16-2.1 2.1-12.4-12.4V40Z"
      />
    </Icon>
  );
}
