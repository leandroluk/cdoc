import {createBrowserRouter} from 'react-router';

import LoginPage from './components/pages/LoginPage';
import LogoffPage from './components/pages/LogoffPage';
import NotFoundPage from './components/pages/NotFoundPage';
import RecoverPage from './components/pages/RecoverPage';

import MainTemplate from './components/templates/MainTemplate';

const router = createBrowserRouter([
  {
    path: '/',
    Component: MainTemplate,
    children: [
      {path: '/login', Component: LoginPage},
      {path: '/logoff', Component: LogoffPage},
      {path: '/recover', Component: RecoverPage},
    ],
  },
  {path: '*', Component: NotFoundPage},
]);

export default router;
