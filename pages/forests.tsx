import Layout from '@components/layouts/Layout';
import withAuth from 'hoc/withAuth';
import React from 'react';

function Forests() {
  return (
    <Layout>
      <>Forests</>
    </Layout>
  );
}

export default withAuth(Forests);
