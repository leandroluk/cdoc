import {ERole, TUser} from '@cdoc/domain';
import {Column, OneToMany, OneToOne} from 'typeorm';
import {uuidv7} from 'uuidv7';
import {CreatableColumn, FullTextEntity, IndexableColumn, RemovableColumn, UpdatableColumn} from '../decorators';
import {CredentialEntity} from './credential.entity';
import {OtpEntity} from './otp.entity';
import {ProfileEntity} from './profile.entity';
import {SsoEntity} from './sso.entity';

@FullTextEntity<TUser>({name: 'user', fullTextFields: ['email']})
export class UserEntity implements TUser {
  @IndexableColumn()
  id: string = uuidv7();

  @UpdatableColumn()
  updatedAt: Date = new Date();

  @CreatableColumn()
  createdAt: Date = new Date();

  @RemovableColumn()
  removedAt: null | Date = null;

  @Column({name: 'email', type: 'varchar', length: 100})
  email: string;

  @Column({name: 'role', type: 'enum', enum: ERole, default: ERole.Member})
  role: ERole;

  //--

  @OneToOne(() => OtpEntity, _ => _.User)
  Otp: OtpEntity;

  @OneToMany(() => SsoEntity, _ => _.User)
  SsoList: SsoEntity[];

  @OneToOne(() => CredentialEntity, _ => _.User)
  Credential: CredentialEntity;

  @OneToOne(() => ProfileEntity, _ => _.User)
  Profile: ProfileEntity;
}
