import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/CreateUserDto.dto";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from "src/users/users.model";
import { InjectModel } from "@nestjs/sequelize";
import { Cart } from "src/carts/carts.model";

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Cart) private cartRepository: typeof Cart
    ) {}

    async login(userDto: CreateUserDto) {
        const data = await this.validateUser(userDto);
        return data;
    }

    async createCart(user: User) {
        const cart = await this.cartRepository.create(
            { id_user: user.id },
            { include: { all: true } }
        );
        return cart;
    }

    async removeToken(refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException({
                message: "Пользователь с таким email не найден",
            });
        }

        const bearer = refreshToken.split(" ")[0];
        const token = refreshToken.split(" ")[1];

        const user = await this.userRepository.findOne({
            where: { refreshToken: token },
        });

        if (!user) {
            throw new UnauthorizedException({
                message: "Пользователь с таким email не найден",
            });
        }

        user.refreshToken = "";
        await user.save();
        return user;
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email);

        if (candidate) {
            throw new HttpException(
                "Пользователь с таким email уже существует",
                HttpStatus.BAD_REQUEST
            );
        }

        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({
            ...userDto,
            password: hashPassword,
        });

        const cart = await this.createCart(user);

        const tokens = this.generateTokens(user);
        await this.userService.saveToken(user.id, tokens.refreshToken);

        return { ...tokens, user: userDto, cart: cart };
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException({
                message: "Пользователь с таким email не найден",
            });
        }
        const bearer = refreshToken.split(" ")[0];
        const token = refreshToken.split(" ")[1];
        const userData = this.validateRefreshToken(token);
        const tokenFromDb = await this.findToken(token);
        if (!userData || !tokenFromDb) {
            throw new UnauthorizedException({
                message: "Пользователь с таким email не найден",
            });
        }
        const user = await this.userRepository.findOne({
            where: { id: userData.id },
        });

        const tokens = this.generateTokens(user);

        await this.userService.saveToken(user.id, tokens.refreshToken);
        return { ...tokens, user: user };
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        if (!user) {
            throw new UnauthorizedException({
                message: "Пользователь с таким email не найден",
            });
        }

        const passwordEquals = await bcrypt.compare(
            userDto.password,
            user.password
        );

        if (!passwordEquals) {
            throw new UnauthorizedException({
                message: "Неверный пароль",
            });
        }

        const tokens = this.generateTokens(user);
        await this.userService.saveToken(user.id, tokens.refreshToken);

        return { ...tokens, userDto };
    }

    async findToken(refreshTokenUser) {
        const tokenData = await this.userRepository.findOne({
            where: { refreshToken: refreshTokenUser },
        });
        return tokenData;
    }

    validateRefreshToken(token: string): User | null {
        try {
            const userData = this.jwtService.verify(token);
            return userData;
        } catch (e) {
            return null;
        }
    }

    private generateTokens(user: User) {
        const payload = { email: user.email, id: user.id, roles: user.roles }; // access token, также нужно создать refresh token и сохранить в БД
        return {
            accessToken: this.jwtService.sign(payload, { expiresIn: "1m" }),
            refreshToken: this.jwtService.sign(payload, { expiresIn: "2m" }),
        };
    }
}
