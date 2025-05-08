import {ROUTES} from '#/constants';
import {userStore} from '#/stores/userStore';
import React, {type PropsWithChildren, useState} from 'react';
import {Outlet, useNavigate} from 'react-router';

namespace PrivateTemplate {
  export type Props = PropsWithChildren;
}
function PrivateTemplate({children = <Outlet />}: PrivateTemplate.Props) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  React.useEffect(() => {
    userStore
      .getState()
      .getProfile()
      .then(() => setChecking(false))
      .catch(() => navigate(ROUTES.LOGIN, {replace: true}));
  }, [setChecking, navigate]);

  if (checking) {
    return null;
  }

  return <>{children}</>;
}

export default PrivateTemplate;
