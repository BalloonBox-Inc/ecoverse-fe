import {
  ChildrenProps,
  ClassNameProps,
} from '@utils/interface/global-interface';
import { twMerge } from 'tailwind-merge';

type Props = ClassNameProps & ChildrenProps;

export default function Badge({ className, children }: Props) {
  return <div className={twMerge(styles.root, className)}>{children}</div>;
}

const styles = {
  root: 'badge gap-1',
};
