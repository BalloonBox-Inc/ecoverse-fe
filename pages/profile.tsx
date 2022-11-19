import Layout from '@components/layouts/Layout';
import WithAuth from 'hoc/withAuth';

function Profile() {
  return (
    <Layout>
      <>Profile</>
    </Layout>
  );
}

export default WithAuth(Profile);
