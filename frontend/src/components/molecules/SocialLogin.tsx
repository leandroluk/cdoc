import {useSearchParams} from 'react-router';

function SocialLogin() {
  const [searchParams] = useSearchParams();
  const url = new URL(window.location.href);
  url.pathname = searchParams.get('redirect') ?? '/';
  return (
    <div className="flex flex-col gap-2">
      <a
        href={`${import.meta.env.VITE_BACKEND_API_URL}/auth/login/microsoft?redirect=${url}`}
        className="btn btn-soft btn-primary items-center justify-center gap-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="size-4">
          <path className="fill-[#f25022]" d="M1 1h9v9H1z" />
          <path className="fill-[#00a4ef]" d="M1 11h9v9H1z" />
          <path className="fill-[#7fba00]" d="M11 1h9v9h-9z" />
          <path className="fill-[#ffb900]" d="M11 11h9v9h-9z" />
        </svg>{' '}
        Entrar com Microsoft
      </a>
    </div>
  );
}
export default SocialLogin;
