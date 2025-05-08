import React from 'react';
import {createRoot} from 'react-dom/client';
import {RouterProvider} from 'react-router';
import MainTemplate from './components/templates/MainTemplate';
import './index.css';
import router from './router';

createRoot(document.getElementById('cdoc') as HTMLDivElement).render(
  <React.StrictMode>
    <MainTemplate>
      <RouterProvider router={router} />
    </MainTemplate>
  </React.StrictMode>
);
