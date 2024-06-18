import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    Header,
    Param,
    ParseFilePipe,
    Post,
    Put,
    Query,
    Res,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Product } from "./products.model";
import { CreateProduct } from "./dto/CreateProduct.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { createReadStream } from "fs";
import { join } from "path";
import { Roles } from "src/auth/roles-auth.decorator";
import { RolesGuard } from "src/auth/roles.guard";

@Controller("products")
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Get()
    getProductByCategory(@Query("category") value: string) {
        return this.productsService.getProductByCategory(value);
    }

    @Get("/download")
    @Header(
        "Content-type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    @Header("Content-Disposition", 'attachment; filename="products.xlsx"')
    async getFile(@Res({ passthrough: true }) res): Promise<StreamableFile> {
        return this.productsService.getProductFileXlsx();
    }

    @ApiOperation({ summary: "Создание продукта" })
    @ApiResponse({ status: 200, type: [Product] })
    @Roles("ADMIN") // ограничиваем доступ к пути только Админу
    @UseGuards(RolesGuard)
    @UseInterceptors(FileInterceptor("image"))
    @Post()
    create(
        @Body() dto: CreateProduct,
        // new ParseFilePipe({
        //     validators: [
        //         new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" }),
        //     ],
        // })
        @UploadedFile()
        file = null
    ) {
        return this.productsService.createProduct(dto, file);
    }

    @ApiOperation({ summary: "Создание продукта" })
    @ApiResponse({ status: 200, type: [Product] })
    @Roles("ADMIN") // ограничиваем доступ к пути только Админу
    @UseGuards(RolesGuard)
    @UseInterceptors(FileInterceptor("image"))
    @Put()
    edit(
        @Body() dto: CreateProduct,
        // new ParseFilePipe({
        //     validators: [
        //         new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" }),
        //     ],
        // })
        @UploadedFile()
        file = null
    ) {
        return this.productsService.editProduct(dto, file);
    }

    @ApiOperation({ summary: "Получить категорию по названию" })
    @ApiResponse({ status: 200, type: [Product] })
    // @Roles("USER") // ограничиваем доступ к пути только Админу
    // @UseGuards(RolesGuard)
    @Get(":product")
    getByValue(@Param("product") value: string) {
        return this.productsService.getProductByValue(value);
    }

    @Roles("ADMIN") // ограничиваем доступ к пути только Админу
    @UseGuards(RolesGuard)
    @Delete()
    deleteProduct(@Body() dto) {
        return this.productsService.deleteProduct(dto);
    }
}
