import {Module} from '@nestjs/common';
import {ImporterModule} from './importer';
import {SystemModule} from './system';

@Module({
  imports: [ImporterModule, SystemModule],
})
export class ResourcesModule {}
