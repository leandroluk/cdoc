import React from 'react';
import {createBrowserRouter} from 'react-router';
import Loader from './components/atoms/Loader';
import Router from './components/atoms/Router';
import LoginPage from './components/pages/LoginPage';
import LogoffPage from './components/pages/LogoffPage';
import NotFoundPage from './components/pages/NotFoundPage';
import RecoverPage from './components/pages/RecoverPage';
import AuthTemplate from './components/templates/AuthTemplate';
import PrivateTemplate from './components/templates/PrivateTemplate';
import {ROUTES} from './constants';
import userStore from './stores/userStore';

const router = createBrowserRouter([
  {
    path: ROUTES.DASHBOARD,
    element: <PrivateTemplate />,
    loader: async () => await userStore.getState().getUserWithProfile(),
    hydrateFallbackElement: <>ovo</>,
    errorElement: <Router.ErrorWrapper component={PrivateTemplate.ErrorBoundary} />,
    children: [
      {
        index: true,
        element: <Loader.Suspense children={React.lazy(() => import('./components/pages/DashboardPage'))} />,
      },
      {
        path: ROUTES.PROFILE,
        element: <Loader.Suspense children={React.lazy(() => import('./components/pages/ProfilePage'))} />,
      },
    ],
  },
  {path: ROUTES.LOGIN, element: <AuthTemplate children={<LoginPage />} />},
  {path: ROUTES.LOGOFF, element: <AuthTemplate children={<LogoffPage />} />},
  {path: ROUTES.RECOVER, element: <AuthTemplate children={<RecoverPage />} />},
  {path: ROUTES.RECOVER, element: <AuthTemplate children={<RecoverPage />} />},
  {path: '*', Component: NotFoundPage},
]);

export default router;
