import {sidebarStore} from '#/stores/sidebarStore';
import userStore from '#/stores/userStore';
import Theme from '../atoms/Theme';
import PageTemplate from '../templates/PageTemplate';

function DashboardPage() {
  const profile = userStore(state => state.user);
  const toggleSidebar = sidebarStore(_ => _.toggle);
  return (
    <PageTemplate>
      <PageTemplate.Main>
        {DashboardPage.name}
        <pre>{JSON.stringify(profile, null, 2)}</pre>
        <Theme.Toggle btnClassName="flex-1" onChange={value => console.log(value)} />
        <button className="btn btn-primary" onClick={toggleSidebar}>
          open
        </button>
      </PageTemplate.Main>
    </PageTemplate>
  );
}

export default DashboardPage;
