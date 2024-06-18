import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector
    ) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(
                ROLES_KEY,
                [context.getHandler(), context.getClass()]
            );
            if (!requiredRoles) {
                // если в декораторе Roles пусто, тогда этим путем может пользоватся любой
                return true;
            }
            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(" ")[0];
            const token = authHeader.split(" ")[1];

            if (bearer != "Bearer" || !token) {
                throw new UnauthorizedException({
                    message: "Пользователь не авторизован",
                });
            }

            const user = this.jwtService.verify(token); // раскодирование токена

            req.user = user;
            return requiredRoles.includes(user.roles);
        } catch (e) {
            throw new HttpException("Нет доступа", HttpStatus.FORBIDDEN);
        }
    }
}
