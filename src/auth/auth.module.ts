import { Module, forwardRef } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";
import { User } from "src/users/users.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { CartsModule } from "src/carts/carts.module";
import { Cart } from "src/carts/carts.model";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        forwardRef(() => UsersModule),
        CartsModule,
        SequelizeModule.forFeature([User, Cart]),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || "SECRET",
            // signOptions: {
            //     expiresIn: "24h",
            // },
        }),
    ],
    exports: [JwtModule, AuthService],
})
export class AuthModule {}
