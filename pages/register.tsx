import OnboardContainer from '@components/layouts/OnboardContainer';
import RegisterInputs from '@components/RegisterInputs';

export default function Register() {
  return (
    <OnboardContainer onboard="register">
      <RegisterInputs />
    </OnboardContainer>
  );
}
