import { iconDefaultProps } from '@utils/helper';
import {
  ChildrenProps,
  ClassNameProps,
} from '@utils/interface/global-interface';
import { twMerge } from 'tailwind-merge';

interface Props extends ChildrenProps {
  className?: ClassNameProps['className'];
  viewBox: string;
}

Icon.defaultProps = { ...iconDefaultProps };

export default function Icon({ className, viewBox, children }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={twMerge(styles.svg, className)}
    >
      <>{children}</>
    </svg>
  );
}

const styles = {
  svg: 'fill-inherit stroke-inherit stroke-1 h-full w-full',
};
