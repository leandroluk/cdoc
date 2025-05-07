import {EProvider, TSso} from '@cdoc/domain';
import {Column, JoinColumn, ManyToOne} from 'typeorm';
import {uuidv7} from 'uuidv7';
import {CreatableColumn, FullTextEntity, IndexableColumn, UpdatableColumn} from '../decorators';
import {UserEntity} from './user.entity';

@FullTextEntity<TSso>({name: 'sso'})
export class SsoEntity implements TSso {
  @IndexableColumn()
  id: string = uuidv7();

  @UpdatableColumn()
  updatedAt: Date = new Date();

  @CreatableColumn()
  createdAt: Date = new Date();

  @Column({name: 'provider', type: 'enum', enum: EProvider})
  provider: EProvider;

  @Column({name: 'key', type: 'varchar', length: 50, default: ''})
  key: string;

  @Column({name: 'user_id', type: 'uuid'})
  userId: string;

  //--

  @ManyToOne(() => UserEntity, _ => _.SsoList, {cascade: true})
  @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
  User: UserEntity;
}
