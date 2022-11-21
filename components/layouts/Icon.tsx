import { ChildrenProps, IconClassName } from '@utils/global-interface';
import { iconDefaultProps } from '@utils/helper';
import { twMerge } from 'tailwind-merge';

interface Props extends ChildrenProps {
  className?: IconClassName;
}

Icon.defaultProps = { ...iconDefaultProps };

export default function Icon({ className, children }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      className={twMerge(styles.svg, className)}
    >
      <>{children}</>
    </svg>
  );
}

const styles = {
  svg: 'fill-inherit stroke-inherit stroke-1 h-full w-full',
};
