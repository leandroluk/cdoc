import {ROUTES} from '#/constants';
import {userStore} from '#/stores/userStore';
import React, {type PropsWithChildren, useState} from 'react';
import {Outlet, useNavigate} from 'react-router';
import Loader from '../../atoms/Loader';
import Sidebar from '../../molecules/Sidebar';

namespace PrivateTemplateRoot {
  export type Props = PropsWithChildren;
}
function PrivateTemplateRoot({children = <Outlet />}: PrivateTemplateRoot.Props) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  React.useEffect(() => {
    userStore
      .getState()
      .getUserWithProfile()
      .then(() => setChecking(false))
      .catch(() => navigate(ROUTES.LOGIN, {replace: true}));
  }, [setChecking, navigate]);

  if (checking) {
    return <Loader className="absolute w-screen h-screen z-50 top-0 left-0" key="loader" />;
  }

  return (
    <div className="flex min-h-screen overflow-hidden bg-base-300 flex-row-reverse">
      <div className="z-10 flex flex-1">{children}</div>
      <Sidebar />
    </div>
  );
}

export default PrivateTemplateRoot;
