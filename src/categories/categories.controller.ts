import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    Param,
    ParseFilePipe,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { createCategoryDto } from "./dto/CreateCategory.dto";
import { Categories } from "./categories.model";
import { FileInterceptor } from "@nestjs/platform-express";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles-auth.decorator";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {}

    @ApiOperation({ summary: "Получить все категории без родителей" })
    @ApiResponse({ status: 200, type: [Categories] })
    @Get()
    getAllCategoriesWithoutParents() {
        return this.categoriesService.getAllCategories();
    }

    @ApiOperation({ summary: "Создание категории" })
    @ApiResponse({ status: 200, type: Categories })
    @Roles("ADMIN") // ограничиваем доступ к пути только Админу
    @UseGuards(RolesGuard)
    @UseInterceptors(FileInterceptor("image"))
    @Post()
    create(
        @Body() dto: createCategoryDto,
        // new ParseFilePipe({
        //     validators: [new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" })],
        // })
        @UploadedFile()
        file = null
    ) {
        return this.categoriesService.createCategory(dto, file);
    }

    @Roles("ADMIN") // ограничиваем доступ к пути только Админу
    @UseGuards(RolesGuard)
    @UseInterceptors(FileInterceptor("image"))
    @Put()
    edit(
        @Body() dto: createCategoryDto,
        // new ParseFilePipe({
        //     validators: [new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" })],
        // })
        @UploadedFile()
        file = null
    ) {
        return this.categoriesService.editCategory(dto, file);
    }

    @Get(":category")
    getChildCategory(@Param("category") value: string) {
        return this.categoriesService.getChildCategoryByValue(value);
    }

    @Roles("ADMIN") // ограничиваем доступ к пути только Админу
    @UseGuards(RolesGuard)
    @Delete()
    deleteCategory(@Body() dto) {
        return this.categoriesService.deleteCategory(dto);
    }
}
