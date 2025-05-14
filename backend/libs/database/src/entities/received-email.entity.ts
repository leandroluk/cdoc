import {TReceivedEmail} from '@cdoc/domain';
import {Column} from 'typeorm';
import {uuidv7} from 'uuidv7';
import {CreatableColumn, FullTextEntity, IndexableColumn} from '../decorators';

@FullTextEntity<TReceivedEmail>({
  name: 'received_email',
  fullTextFields: ['subject', 'from', 'to', 'cc', 'body', 'attachmentList'],
})
export class ReceivedEmailEntity implements TReceivedEmail {
  @IndexableColumn()
  id: string = uuidv7();

  @CreatableColumn()
  createdAt: Date = new Date();

  @Column({name: 'subject', type: 'text'})
  subject: string;

  @Column({name: 'from', type: 'text'})
  from: string;

  @Column({name: 'to', type: 'text'})
  to: string;

  @Column({name: 'cc', type: 'text'})
  cc: string;

  @Column({name: 'body', type: 'text'})
  body: string;

  @Column({name: 'attachment_list', type: 'text'})
  attachmentList: string;
}
