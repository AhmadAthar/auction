import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { generateUsers, IUser } from '@app/common';

@Injectable()
export class UserService {

    public constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    public async createUser(createUserDto: any) {
        const { firstName, lastName } = createUserDto;
        return await this.userRepository.save(
            this.userRepository.create({ firstName, lastName})
        )
     }

    public async populateUsers(): Promise<IUser[]> {
        const users: Partial<IUser>[] = generateUsers(100);
        console.log("users: ", users)
        return await Promise.all(users.map(user => {
            return this.userRepository.save(
                this.userRepository.create({
                    firstName: user.firstName,
                    lastName: user.lastName,
                })
            )
        }))
    }

}
