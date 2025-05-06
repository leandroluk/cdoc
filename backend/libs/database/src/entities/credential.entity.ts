import {TCredential} from '@cdoc/domain';
import {Column, JoinColumn, OneToOne} from 'typeorm';
import {FullTextEntity, IndexableColumn, UpdatableColumn} from '../decorators';
import {UserEntity} from './user.entity';

@FullTextEntity<TCredential>({name: 'credential'})
export class CredentialEntity implements TCredential {
  @IndexableColumn()
  id!: string;

  @UpdatableColumn()
  updatedAt!: Date;

  @Column({name: 'password', type: 'text'})
  password!: string;

  @Column({name: 'is_active', type: 'boolean', default: false})
  isActive!: boolean;

  @Column({name: 'user_id', type: 'uuid'})
  userId!: string;

  //--

  @OneToOne(() => UserEntity, _ => _.Credential, {cascade: true})
  @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
  User!: UserEntity;
}
