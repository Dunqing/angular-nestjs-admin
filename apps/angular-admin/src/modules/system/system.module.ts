import { SystemService } from './system.service';
import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';

@Module({
    imports: [],
    controllers: [
        SystemController
    ],
    providers: [
        SystemService
    ],
})
export class SystemModule {}
