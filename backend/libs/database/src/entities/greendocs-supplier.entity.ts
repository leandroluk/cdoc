import {TGreendocsProject, TGreendocsSupplier} from '@cdoc/domain';
import {Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {GreendocsProjectEntity} from './greendocs-project.entity';

@Entity({name: 'GreendocsSupplier'})
export class GreendocsSupplierEntity implements TGreendocsSupplier {
  @PrimaryColumn({type: 'int'})
  id: number;

  @UpdateDateColumn({type: 'timestamptz', precision: 3})
  updatedAt: Date;

  @CreateDateColumn({type: 'timestamptz', precision: 3})
  createdAt: Date;

  @DeleteDateColumn({type: 'timestamptz', precision: 3, nullable: true})
  removedAt: null | Date;

  @Column({type: 'int'})
  instanceId: number;

  @Column({type: 'text'})
  link: string;

  @Column({type: 'text'})
  name: string;

  @Column({type: 'text'})
  supplierName: string;

  @Column({type: 'text'})
  address: string;

  @Column({type: 'text'})
  city: string;

  @Column({type: 'text'})
  state: string;

  @Column({type: 'text'})
  zipCode: string;

  @Column({type: 'text'})
  email: string;

  @Column({type: 'text'})
  phone: string;

  @Column({type: 'text'})
  responsible: string;

  @Column({type: 'text'})
  inAttentionBy: string;

  @Column({type: 'text'})
  situation: string;

  @Column({type: 'int'})
  greendocsProjectId: TGreendocsProject['id'];

  @ManyToOne(() => GreendocsProjectEntity, _ => _.GreendocsSupplierList, {cascade: true})
  GreendocsProject: GreendocsProjectEntity;
}
