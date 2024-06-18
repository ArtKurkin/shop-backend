import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { Product } from "./products.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { Categories } from "src/categories/categories.model";
import { CategoriesModule } from "src/categories/categories.module";
import { FilesModule } from "src/files/files.module";
import { AuthModule } from "src/auth/auth.module";
import { User } from "src/users/users.model";
import { Orders } from "src/orders/orders.model";
import { ProductOrders } from "src/orders/products-orders";

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    imports: [
        SequelizeModule.forFeature([
            Product,
            Categories,
            User,
            Orders,
            ProductOrders,
        ]),
        CategoriesModule,
        FilesModule,
        AuthModule,
    ],
})
export class ProductsModule {}
