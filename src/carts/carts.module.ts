import { Module, forwardRef } from "@nestjs/common";
import { CartsController } from "./carts.controller";
import { CartsService } from "./carts.service";
import { Cart } from "./carts.model";
import { Product } from "src/products/products.model";
import { ProductCart } from "./products-carts.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";

@Module({
    controllers: [CartsController],
    providers: [CartsService],
    imports: [
        SequelizeModule.forFeature([Cart, Product, ProductCart]),
        UsersModule,
        forwardRef(() => AuthModule),
    ],
    exports: [CartsService],
})
export class CartsModule {}
