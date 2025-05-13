import {ROUTES} from '#/constants';
import {NetworkError, ServerError, UnauthorizedError} from '@cdoc/domain';
import React from 'react';
import {useNavigate} from 'react-router';

namespace PrivateTemplateErrorBoundary {
  export type Props = {error: Error};
}
function PrivateTemplateErrorBoundary({error}: PrivateTemplateErrorBoundary.Props) {
  const navigate = useNavigate();

  React.useLayoutEffect(() => {
    if ([ServerError, UnauthorizedError, NetworkError].some(({is}) => is(error))) {
      navigate(ROUTES.LOGIN, {replace: true}); // eslint-disable-line @typescript-eslint/no-floating-promises
    }
  }, [navigate, error]);

  return <></>;
}

export default PrivateTemplateErrorBoundary;
