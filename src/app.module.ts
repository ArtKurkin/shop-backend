import { Module } from "@nestjs/common";
import { CategoriesModule } from "./categories/categories.module";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";
import { Categories } from "./categories/categories.model";
import { ProductsModule } from "./products/products.module";
import { Product } from "./products/products.model";
import { FilesModule } from "./files/files.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { CartsModule } from "./carts/carts.module";
import { ProductCart } from "./carts/products-carts.model";
import { Cart } from "./carts/carts.model";
import { OrdersModule } from "./orders/orders.module";
import { ProductOrders } from "./orders/products-orders";
import { Orders } from "./orders/orders.model";

@Module({
    imports: [
        CategoriesModule,
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        SequelizeModule.forRoot({
            dialect: "postgres",
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [
                Categories,
                Product,
                ProductCart,
                Cart,
                ProductCart,
                ProductOrders,
                Orders,
            ],
            autoLoadModels: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, "..", "static"),
        }),
        ProductsModule,
        FilesModule,
        AuthModule,
        UsersModule,
        CartsModule,
        OrdersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
