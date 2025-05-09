import {TWorkspace} from '@cdoc/domain';
import {Column, Entity, OneToMany} from 'typeorm';
import {uuidv7} from 'uuidv7';
import {CreatableColumn, IndexableColumn, RemovableColumn, UpdatableColumn} from '../decorators';
import {SupplierEntity} from './supplier.entity';

@Entity({name: 'workspace'})
export class WorkspaceEntity implements TWorkspace {
  @IndexableColumn()
  id: string = uuidv7();

  @UpdatableColumn()
  updatedAt: Date = new Date();

  @CreatableColumn()
  createdAt: Date = new Date();

  @RemovableColumn()
  removedAt: null | Date = null;

  @Column({name: 'link', type: 'text'})
  link: string;

  @Column({name: 'submenu_selector', type: 'text', nullable: true})
  submenuSelector: null | string;

  @Column({name: 'suppliers_extraction_at', type: 'timestamptz', precision: 3, nullable: true})
  suppliersExtractionAt: null | Date;

  @Column({name: 'suppliers_view_link', type: 'text', nullable: true})
  suppliersViewLink: null | string;

  @Column({name: 'reserve_view_link', type: 'text', nullable: true})
  reserveViewLink: null | string;

  @Column({name: 'greendocs_id', type: 'integer', unique: true})
  greendocsId: number;

  @Column({name: 'greendocs_name', type: 'varchar', length: 100})
  greendocsName: string;

  //--

  @OneToMany(() => SupplierEntity, _ => _.Workspace)
  SupplierList: SupplierEntity[];
}
