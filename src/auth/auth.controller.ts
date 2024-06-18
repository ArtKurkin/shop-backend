import {
    Body,
    Controller,
    Get,
    Headers,
    Post,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/CreateUserDto.dto";
import { Roles } from "./roles-auth.decorator";
import { RolesGuard } from "./roles.guard";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Roles("ADMIN") // ограничиваем доступ к пути только Админу
    @UseGuards(RolesGuard)
    @Get()
    isAdmin() {
        return true;
    }

    @Roles("USER", "ADMIN") // ограничиваем доступ к пути только Админу
    @UseGuards(RolesGuard)
    @Get("/isauth")
    isAuth() {
        return true;
    }

    @Post("/login")
    login(@Body() userDto: CreateUserDto) {
        return this.authService.login(userDto);
    }

    @Post("/registration")
    registration(@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto);
    }

    @Post("/refresh")
    refresh(@Headers() headers) {
        return this.authService.refresh(headers.authorization);
    }

    @Post("/logout")
    logout(@Headers() headers) {
        return this.authService.removeToken(headers.authorization);
    }
}
