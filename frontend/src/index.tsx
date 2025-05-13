import React from 'react';
import {createRoot} from 'react-dom/client';
import {RouterProvider} from 'react-router';
import RootTemplate from './components/templates/RootTemplate';
import './index.css';
import router from './router';

createRoot(document.getElementById('cdoc') as HTMLDivElement).render(
  <React.StrictMode>
    <RootTemplate>
      <RouterProvider router={router} />
    </RootTemplate>
  </React.StrictMode>
);
