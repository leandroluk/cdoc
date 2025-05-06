import {ETheme, TProfile} from '@cdoc/domain';
import {Column, JoinColumn, OneToOne} from 'typeorm';
import {FullTextEntity, IndexableColumn, UpdatableColumn} from '../decorators';
import {UserEntity} from './user.entity';

@FullTextEntity<TProfile>({name: 'profile', fullTextFields: ['givenName', 'familyName']})
export class ProfileEntity implements TProfile {
  @IndexableColumn()
  id!: string;

  @UpdatableColumn()
  updatedAt!: Date;

  @Column({name: 'given_name', type: 'varchar', length: 100, nullable: true})
  givenName!: null | string;

  @Column({name: 'family_name', type: 'varchar', length: 100, nullable: true})
  familyName!: null | string;

  @Column({name: 'picture', type: 'text', nullable: true})
  picture!: null | string;

  @Column({name: 'cover', type: 'text', nullable: true})
  cover!: null | string;

  @Column({name: 'locale', type: 'varchar', length: 10})
  locale!: string;

  @Column({name: 'theme', type: 'enum', enum: ETheme, default: ETheme.Light})
  theme!: ETheme;

  @Column({name: 'timezone', type: 'varchar', length: 50})
  timezone!: string;

  @Column({name: 'user_id', type: 'uuid'})
  userId!: string;

  //--

  @OneToOne(() => UserEntity, _ => _.Profile, {cascade: true})
  @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
  User!: UserEntity;
}
