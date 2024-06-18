import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users.model";

@Module({
    providers: [UsersService],
    exports: [UsersService],
    imports: [SequelizeModule.forFeature([User])],
})
export class UsersModule {}
