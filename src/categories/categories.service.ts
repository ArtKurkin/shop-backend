import { Injectable } from "@nestjs/common";
import { Categories } from "./categories.model";
import { InjectModel } from "@nestjs/sequelize";
import { createCategoryDto } from "./dto/CreateCategory.dto";
import { FilesService } from "src/files/files.service";
const translit = require("translit-rus-eng");

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Categories) private categoryRepository: typeof Categories,
        private fileService: FilesService
    ) {}

    async deleteCategory(dto: any) {
        const category = await this.categoryRepository.findOne({
            where: { id: dto.id },
        });

        if (category) {
            return await category.destroy();
        }
    }

    async editCategory(dto: createCategoryDto, file = null) {
        let fileName;
        if (file && file.size > 0) {
            fileName = await this.fileService.createFile(file);
        }

        const { title } = dto;
        const CyrillicToTranslit = translit(title, {
            slug: true,
            lowerCase: true,
        }).replace(/_/g, "-");
        const category = await this.categoryRepository.findOne({
            where: { id: dto.id },
        });

        const img = file ? fileName : category.image;

        category.set({
            ...dto,
            translit: CyrillicToTranslit,
            image: img,
        });
        const result = await category.save();
        return result;
    }

    async getAllCategories() {
        const categories = await this.categoryRepository.findAll({
            where: { idParent: null },
            include: { all: true },
        });
        return categories;
    }

    async createCategory(dto: createCategoryDto, file = null) {
        let fileName;
        if (file && file.size > 0) {
            fileName = await this.fileService.createFile(file);
        }
        const { title } = dto;
        const CyrillicToTranslit = translit(title, {
            slug: true,
            lowerCase: true,
        }).replace(/_/g, "-");
        const img = file ? fileName : null;
        const categories = await this.categoryRepository.create({
            ...dto,
            translit: CyrillicToTranslit,
            image: img,
        });
        return categories;
    }

    async getChildCategoryByValue(value: string) {
        const { id, title } = await this.categoryRepository.findOne({
            where: { translit: value },
        });
        const category = await this.categoryRepository.findAll({
            where: { idParent: id },
        });
        return { it: category, title, id };
    }
}
