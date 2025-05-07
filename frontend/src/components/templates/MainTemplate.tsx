import {Outlet} from 'react-router';

function MainTemplate() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}

export default MainTemplate;
