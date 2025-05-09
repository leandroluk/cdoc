import userStore from '#/stores/userStore';
import Theme from '../atoms/Theme';

function DashboardPage() {
  const profile = userStore(state => state.profile);
  return (
    <div>
      {DashboardPage.name}
      <pre>{JSON.stringify(profile, null, 2)}</pre>
      <Theme.Toggle btnClassName="flex-1" />
    </div>
  );
}

export default DashboardPage;
