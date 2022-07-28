import { Controller, Get } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { User } from './types';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('current')
  getCurrentUser(@GetCurrentUserId() userId: string): Promise<User> {
    return this.usersService.getCurrentUser(userId);
  }
}
