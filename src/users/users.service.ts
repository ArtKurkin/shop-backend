import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./users.model";
import { CreateUserDto } from "src/users/dto/CreateUserDto.dto";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User) {}

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create({
            ...dto,
            roles: "USER",
        });
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            include: { all: true },
        });

        return user;
    }

    async saveToken(userId: number, refreshToken: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (user) {
            user.refreshToken = refreshToken;
            return user.save();
        }
        // const token = await tokenModel.create({user: userId, refreshToken})
        // return token;
    }
}
