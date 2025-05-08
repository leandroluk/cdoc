import React from 'react';
import {createBrowserRouter} from 'react-router';
import Loader from './components/atoms/Loader';
import LoginPage from './components/pages/LoginPage';
import LogoffPage from './components/pages/LogoffPage';
import NotFoundPage from './components/pages/NotFoundPage';
import RecoverPage from './components/pages/RecoverPage';
import AuthTemplate from './components/templates/AuthTemplate';
import {ROUTES} from './constants';

const router = createBrowserRouter([
  {
    path: ROUTES.DASHBOARD,
    index: true,
    element: <Loader.Suspense children={React.lazy(() => import('#/components/pages/DashboardPage'))} />,
  },
  {path: ROUTES.LOGIN, element: <AuthTemplate children={<LoginPage />} />},
  {path: ROUTES.LOGOFF, element: <AuthTemplate children={<LogoffPage />} />},
  {path: ROUTES.RECOVER, element: <AuthTemplate children={<RecoverPage />} />},
  {path: '*', Component: NotFoundPage},
]);

export default router;
