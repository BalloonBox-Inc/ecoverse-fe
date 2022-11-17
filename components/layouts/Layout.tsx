import Header from '@components/layouts/Header';
import { ChildrenProps as Props } from '@utils/global-interface';

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
