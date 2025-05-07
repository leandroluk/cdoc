import {TProject, TSupplier} from '@cdoc/domain';
import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import {uuidv7} from 'uuidv7';
import {CreatableColumn, IndexableColumn, RemovableColumn, UpdatableColumn} from '../decorators';
import {ProjectEntity} from './project.entity';

@Entity({name: 'supplier'})
export class SupplierEntity implements TSupplier {
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

  @Column({name: 'greendocs_doc_id', type: 'integer', unique: true})
  greendocsDocId: number;

  @Column({name: 'greendocs_instance_id', type: 'integer'})
  greendocsInstanceId: number;

  @Column({name: 'greendocs_name', type: 'text'})
  greendocsName: string;

  @Column({name: 'greendocs_supplier_name', type: 'text'})
  greendocsSupplierName: string;

  @Column({name: 'greendocs_address', type: 'text'})
  greendocsAddress: string;

  @Column({name: 'greendocs_city', type: 'text'})
  greendocsCity: string;

  @Column({name: 'greendocs_state', type: 'text'})
  greendocsState: string;

  @Column({name: 'greendocs_zip_code', type: 'text'})
  greendocsZipCode: string;

  @Column({name: 'greendocs_email', type: 'text'})
  greendocsEmail: string;

  @Column({name: 'greendocs_phone', type: 'text'})
  greendocsPhone: string;

  @Column({name: 'greendocs_responsible', type: 'text'})
  greendocsResponsible: string;

  @Column({name: 'greendocs_in_attention_by', type: 'text'})
  greendocsInAttentionBy: string;

  @Column({name: 'greendocs_situation', type: 'text'})
  greendocsSituation: string;

  @Column({name: 'project_id', type: 'uuid'})
  projectId: TProject['id'];

  //--

  @ManyToOne(() => ProjectEntity, _ => _.SupplierList, {cascade: true})
  @JoinColumn({name: 'project_id', referencedColumnName: 'id'})
  Project: ProjectEntity;
}
