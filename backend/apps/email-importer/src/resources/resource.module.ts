import {Module} from '@nestjs/common';
import {SystemModule} from './system';

@Module({
  imports: [SystemModule],
})
export class ResourcesModule {}
