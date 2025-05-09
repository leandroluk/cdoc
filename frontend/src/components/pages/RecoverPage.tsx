import {PiArrowCircleLeftDuotone} from 'react-icons/pi';
import {useNavigate, useSearchParams} from 'react-router';
import OtpAuthForm from '../organisms/OtpAuthForm';
import RecoverAuthForm from '../organisms/RecoverAuthForm';

function RecoverPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <div className="flex flex-col gap-4">
      {searchParams.has('otp') ? (
        <>
          <OtpAuthForm onSend={() => navigate('?')} />
          <a href="?" className="btn btn-outline">
            Já tem um código?
          </a>
        </>
      ) : (
        <>
          <RecoverAuthForm />
          <a href="?otp" className="btn btn-outline">
            Não tem um código?
          </a>
        </>
      )}
      <a href="/login" className="btn btn-link btn-sm group">
        <PiArrowCircleLeftDuotone className="size-5 transition-transform duration-200 group-hover:-translate-x-1" />
        Voltar para Login
      </a>
    </div>
  );
}

export default RecoverPage;
