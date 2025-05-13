import {useSearchParams} from 'react-router';
import Svg from '../atoms/Svg';

function SocialLogin() {
  const [searchParams] = useSearchParams();
  const url = new URL(window.location.href);
  url.pathname = searchParams.get('redirect') ?? '/';
  return (
    <div className="flex flex-col gap-3">
      <a
        href={`${import.meta.env.VITE_BACKEND_API_URL}/auth/login/microsoft?redirect=${url}`}
        className="btn btn-soft btn-primary items-center justify-center gap-3"
      >
        <Svg.Microsoft /> Entrar com Microsoft
      </a>
    </div>
  );
}
export default SocialLogin;
