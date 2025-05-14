import {ROUTES} from '#/constants';
import userStore from '#/stores/userStore';
import Avatar from '../atoms/Avatar';
import Breadcrumbs from '../atoms/Breadcrumbs';
import ProfileForm from '../organisms/ProfileForm';
import UploadAvatarForm from '../organisms/UploadAvatarForm';
import PageTemplate from '../templates/PageTemplate';

function ProfilePage() {
  const {user} = userStore();

  return (
    <PageTemplate>
      <PageTemplate.Header>
        <Breadcrumbs>
          <Breadcrumbs.List>
            <Breadcrumbs.Link path={ROUTES.PRIVATE} className="btn-square" />
            <Breadcrumbs.Text>Perfil</Breadcrumbs.Text>
          </Breadcrumbs.List>
        </Breadcrumbs>
      </PageTemplate.Header>
      <PageTemplate.Main className="flex justify-center items-center">
        <section className="flex flex-col container mx-auto max-w-lg gap-3">
          <div className="relative bg-base-100 rounded overflow-hidden">
            <div className="z-0 bg-primary absolute inset-0 h-8" />
            <div className="z-10 flex flex-row p-3 justify-between">
              <div className="relative rounded-full overflow-hidden">
                <Avatar
                  childClassName="size-20 border-5 border-base-300"
                  src={user?.Profile.avatarPicture}
                  placeholder={user?.Profile.avatarPlaceholder}
                />
                <UploadAvatarForm className="absolute btn btn-ghost h-full right-0 left-0 bottom-0 opacity-0 hover:opacity-100" />
              </div>

              <div className="z-10 text-end mt-8">
                <div className="font-semibold">{user?.Profile.fullName}</div>
                <small>{user?.email}</small>
              </div>
            </div>
          </div>

          <div className="bg-base-100 p-3 rounded">
            <ProfileForm />
          </div>
        </section>
      </PageTemplate.Main>
    </PageTemplate>
  );
}

export default ProfilePage;
