import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';

// users.module.ts - Module configuration
// users.controller.ts - API endpoints for user operations
// users.service.ts - Business logic for user operations
// schemas/user.schema.ts - MongoDB schema for users
// Test files (.spec.ts)

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export for use in AuthModule
})
export class UsersModule {}
