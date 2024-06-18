import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Product } from "src/products/products.model";
import { ProductOrders } from "./products-orders";
import { Orders } from "./orders.model";
import { Cart } from "src/carts/carts.model";
import { AuthModule } from "src/auth/auth.module";
import { ProductCart } from "src/carts/products-carts.model";

@Module({
    controllers: [OrdersController],
    providers: [OrdersService],
    imports: [
        SequelizeModule.forFeature([
            Product,
            ProductOrders,
            ProductCart,
            Orders,
            Cart,
        ]),
        AuthModule,
    ],
})
export class OrdersModule {}
