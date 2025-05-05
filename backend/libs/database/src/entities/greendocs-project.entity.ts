import {TGreendocsProject} from '@cdoc/domain';
import {Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {GreendocsSupplierEntity} from './greendocs-supplier.entity';

@Entity({name: 'GreendocsProject'})
export class GreendocsProjectEntity implements TGreendocsProject {
  @PrimaryColumn({type: 'int'})
  id: number;

  @UpdateDateColumn({type: 'timestamptz', precision: 3})
  updatedAt: Date;

  @CreateDateColumn({type: 'timestamptz', precision: 3})
  createdAt: Date;

  @DeleteDateColumn({type: 'timestamptz', precision: 3, nullable: true})
  removedAt: null | Date;

  @Column({type: 'text'})
  link: string;

  @Column({type: 'varchar', length: 100})
  name: string;

  @Column({type: 'text', nullable: true})
  submenuSelector: null | string;

  @Column({type: 'timestamptz', precision: 3, nullable: true})
  suppliersExtractionAt: null | Date;

  @Column({type: 'text', nullable: true})
  suppliersViewLink: null | string;

  @Column({type: 'text', nullable: true})
  reserveViewLink: null | string;

  @OneToMany(() => GreendocsSupplierEntity, _ => _.GreendocsProject)
  GreendocsSupplierList: GreendocsSupplierEntity[];
}
