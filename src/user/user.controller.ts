import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser } from '@app/common';

@Controller('user')
export class UserController {

    public constructor(
        private readonly userService: UserService
    ){}

    @Post('populateUsers')
    public populateUsers(): Promise<IUser[]>{
        return this.userService.populateUsers();
    }

    @Post('createUser')
    public createUser(
        @Body() createUserDto: any
    ){
        return this.userService.createUser(createUserDto)
    }
}
