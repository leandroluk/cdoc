import {PiArrowCircleLeft} from 'react-icons/pi';
import {useNavigate, useSearchParams} from 'react-router';
import OtpAuthForm from '../organisms/OtpAuthForm';
import RecoverAuthForm from '../organisms/RecoverAuthForm';

function RecoverPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <div className="flex flex-col gap-3">
      {searchParams.has('otp') ? (
        <>
          <OtpAuthForm onSend={() => navigate('?')} />
          <p onClick={() => navigate('?')} className="btn btn-outline">
            Já tem um código?
          </p>
        </>
      ) : (
        <>
          <RecoverAuthForm />
          <p onClick={() => navigate('?otp')} className="btn btn-outline">
            Não tem um código?
          </p>
        </>
      )}
      <span onClick={() => navigate('/login')} className="btn btn-link btn-sm group">
        <PiArrowCircleLeft className="size-5 transition-transform duration-200 group-hover:-translate-x-1" />
        Voltar para Login
      </span>
    </div>
  );
}

export default RecoverPage;
