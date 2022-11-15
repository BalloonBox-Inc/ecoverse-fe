import Header from '@components/layouts/Header';
import React from 'react';

interface Props {
  children: React.ReactElement | String | Number;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
