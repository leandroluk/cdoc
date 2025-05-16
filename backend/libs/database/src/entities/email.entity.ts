import {TEmail} from '@cdoc/domain';
import {Column} from 'typeorm';
import {uuidv7} from 'uuidv7';
import {CreatableColumn, FullTextEntity, IndexableColumn} from '../decorators';

@FullTextEntity<TEmail>({
  name: 'email',
  fullTextFields: ['subject', 'body'],
})
export class EmailEntity implements TEmail {
  @IndexableColumn()
  id: string = uuidv7();
  @CreatableColumn()
  createdAt: Date = new Date();

  @Column({name: 'subject', type: 'text'})
  subject: string;

  @Column({name: 'body', type: 'text'})
  body: string;

  @Column({name: 'from_list', type: 'text', array: true})
  fromList: string[];

  @Column({name: 'to_list', type: 'text', array: true})
  toList: string[];

  @Column({name: 'cc_list', type: 'text', array: true})
  ccList: string[];

  @Column({name: 'attachment_list', type: 'text', array: true})
  attachmentList: string[];
}
