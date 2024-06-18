import {
    Body,
    Controller,
    Post,
    UseGuards,
    Headers,
    Get,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles-auth.decorator";

@Controller("orders")
export class OrdersController {
    constructor(private ordersService: OrdersService) {}

    @Roles("USER", "ADMIN") // ограничиваем доступ к пути только Админу
    @UseGuards(RolesGuard)
    @Get()
    getOrders(@Headers() headers) {
        return this.ordersService.getOrders(headers.authorization);
    }

    @Roles("USER", "ADMIN") // ограничиваем доступ к пути только Админу
    @UseGuards(RolesGuard)
    @Post("/create")
    createOrder(@Body() body, @Headers() headers) {
        return this.ordersService.createOrder(body, headers);
    }
}
