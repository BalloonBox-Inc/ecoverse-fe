import Layout from '@components/layouts/Layout';

export default function login() {
  const handleLogin = async () => {
    const response = await fetch('http://localhost:5002/pub/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'Jerick', password: 'password' }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    console.log(data);
  };

  const handleCheckAuth = async () => {
    const response = await fetch('http://localhost:5002/user', {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <Layout>
      <div className="flex gap-4">
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleCheckAuth}>Check</button>
      </div>
    </Layout>
  );
}
