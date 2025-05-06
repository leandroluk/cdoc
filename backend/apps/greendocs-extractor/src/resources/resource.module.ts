import {Module} from '@nestjs/common';
import {ExtractorModule} from './extractor';
import {SystemModule} from './system';

@Module({
  imports: [ExtractorModule, SystemModule],
})
export class ResourcesModule {}
