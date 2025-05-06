import {Module} from '@nestjs/common';
import {AuthModule} from './auth';
import {SystemModule} from './system';
import {UserModule} from './user';

@Module({
  imports: [AuthModule, SystemModule, UserModule],
})
export class ResourcesModule {}
