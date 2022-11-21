import Layout from '@components/layouts/Layout';
import { useAuth } from '@context/auth';
import WithAuth from 'hoc/withAuth';

function Profile() {
  const { userAuth } = useAuth();

  return (
    <Layout>
      {userAuth ? <p>here {userAuth.user}</p> : <p>Loading...</p>}
    </Layout>
  );
}

export default WithAuth(Profile);
