import {
    Controller,
    Post,
    UseGuards,
    Headers,
    Body,
    Get,
    Delete,
    Put,
} from "@nestjs/common";
import { CartsService } from "./carts.service";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles-auth.decorator";

@Controller("carts")
export class CartsController {
    constructor(private cartService: CartsService) {}

    @Roles("USER", "ADMIN")
    @UseGuards(RolesGuard)
    @Get()
    getCart(@Headers() headers) {
        return this.cartService.getCart(headers.authorization);
    }

    @Roles("USER", "ADMIN")
    @UseGuards(RolesGuard)
    @Delete("/delete")
    deleteFromCart(@Headers() headers, @Body() body) {
        return this.cartService.deleteFromCart(body, headers.authorization);
    }

    @Roles("USER", "ADMIN")
    @UseGuards(RolesGuard)
    @Put()
    increaseProduct(@Headers() headers, @Body() body) {
        return this.cartService.increaseProduct(body, headers.authorization);
    }

    @Roles("USER", "ADMIN")
    @UseGuards(RolesGuard)
    @Put("/decrease")
    decreaseProduct(@Headers() headers, @Body() body) {
        return this.cartService.decreaseProduct(body, headers.authorization);
    }

    @Roles("USER", "ADMIN")
    @UseGuards(RolesGuard)
    @Post("/add")
    addInCart(@Body() body, @Headers() headers) {
        return this.cartService.addInCart(
            body.idProduct,
            headers.authorization
        );
    }
}
