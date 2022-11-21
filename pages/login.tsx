import OnboardContainer from '@components/layouts/OnboardContainer';
import LoginInputs from '@components/LoginInputs';

export default function Login() {
  return (
    <OnboardContainer onboard="login">
      <LoginInputs />
    </OnboardContainer>
  );
}
