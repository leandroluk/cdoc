import SocialLogin from '../molecules/SocialLogin';
import LoginAuthCredentialForm from '../organisms/LoginAuthCredentialForm';

function LoginPage() {
  return (
    <div className="flex flex-col">
      <LoginAuthCredentialForm />
      <div className="divider text-xs">ou</div>
      <SocialLogin />
    </div>
  );
}

export default LoginPage;
