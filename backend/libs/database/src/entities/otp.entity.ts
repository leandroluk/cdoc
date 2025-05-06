import {TOtp} from '@cdoc/domain';
import {Column, JoinColumn, OneToOne} from 'typeorm';
import {FullTextEntity, IndexableColumn, UpdatableColumn} from '../decorators';
import {UserEntity} from './user.entity';

@FullTextEntity<TOtp>({name: 'otp'})
export class OtpEntity implements TOtp {
  @IndexableColumn()
  id!: string;

  @UpdatableColumn()
  updatedAt!: Date;

  @Column({name: 'expires_at', type: 'timestamptz', precision: 3})
  expiresAt!: Date;

  @Column({name: 'code', type: 'char', length: 6})
  code!: string;

  @Column({name: 'user_id', type: 'uuid'})
  userId!: string;

  //--

  @OneToOne(() => UserEntity, _ => _.Otp, {cascade: true})
  @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
  User!: UserEntity;
}
