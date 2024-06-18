import { Module } from "@nestjs/common";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { Categories } from "./categories.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { Product } from "src/products/products.model";
import { FilesModule } from "src/files/files.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
    controllers: [CategoriesController],
    providers: [CategoriesService],
    imports: [
        SequelizeModule.forFeature([Categories, Product]),
        FilesModule,
        AuthModule,
    ],
    exports: [CategoriesService],
})
export class CategoriesModule {}
