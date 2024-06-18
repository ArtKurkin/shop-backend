import {
    HttpException,
    HttpStatus,
    Injectable,
    StreamableFile,
} from "@nestjs/common";
import { Product } from "./products.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateProduct } from "./dto/CreateProduct.dto";
import { CategoriesService } from "src/categories/categories.service";
import { FilesService } from "src/files/files.service";
import { Categories } from "src/categories/categories.model";
import { createReadStream } from "fs";
import { join } from "path";
const translit = require("translit-rus-eng");
const ExcelJS = require("exceljs");

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product) private productRepository: typeof Product,
        @InjectModel(Categories)
        private categoriesRepository: typeof Categories,
        private categoriesService: CategoriesService,
        private fileService: FilesService
    ) {}

    async getProductFileXlsx(): Promise<StreamableFile> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(
            join(process.cwd(), "static", "template.xlsx")
        );
        const worksheet = workbook.getWorksheet("template");

        const categories = await this.categoriesRepository.findAll({
            include: { all: true },
        });

        worksheet.getColumn(1).width = 5;
        worksheet.getColumn(2).width = 5;
        worksheet.getColumn(3).width = 20;
        worksheet.getColumn(4).width = 15;
        worksheet.getColumn(5).width = 20;
        worksheet.mergeCells(`B2:E2`);
        worksheet.getCell(`A2`).value = "№";
        worksheet.getCell(`B2`).value = "Название категории";

        let i = 3;
        categories.forEach((item, index, arr) => {
            worksheet.mergeCells(`B${i}:E${i}`);
            worksheet.getCell(`A${i}`).value = index + 1;
            worksheet.getCell(`B${i}`).value = item.dataValues.title;

            i += 1;

            worksheet.getCell(`B${i}`).value = "№";
            worksheet.getCell(`C${i}`).value = "Название товара";
            worksheet.getCell(`D${i}`).value = "Цена, руб.";
            worksheet.getCell(`E${i}`).value = "Количество, шт.";

            i += 1;

            item.dataValues.products.forEach((item, index) => {
                worksheet.getCell(`B${i}`).value = index + 1;
                worksheet.getCell(`C${i}`).value = item.dataValues.title;
                worksheet.getCell(`D${i}`).value = item.dataValues.price;
                worksheet.getCell(`E${i}`).value = item.dataValues.quantity;

                i += 1;
            });
        });

        await workbook.xlsx.writeFile(
            join(process.cwd(), "static", "products.xlsx")
        );

        const file = createReadStream(
            join(process.cwd(), "static", "products.xlsx")
        );

        return new StreamableFile(file);
    }

    async deleteProduct(dto) {
        const product = await this.productRepository.findOne({
            where: { id: dto.id },
        });

        if (product) {
            return await product.destroy();
        }
    }

    async getProductByValue(value: string) {
        const product = await this.productRepository.findOne({
            where: { translit: value },
        });

        if (!product) {
            throw new HttpException(
                "Пользователь не найдены",
                HttpStatus.NOT_FOUND
            );
        }
        return product;
    }

    async createProduct(dto: CreateProduct, file = null) {
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
        const product = await this.productRepository.create({
            ...dto,
            translit: CyrillicToTranslit,
            image: img,
        });
        return product;
    }

    async editProduct(dto: CreateProduct, file = null) {
        let fileName;
        if (file && file.size > 0) {
            fileName = await this.fileService.createFile(file);
        }

        const { title } = dto;
        const CyrillicToTranslit = translit(title, {
            slug: true,
            lowerCase: true,
        }).replace(/_/g, "-");

        const product = await this.productRepository.findOne({
            where: { id: dto.id },
        });

        const img = file ? fileName : product.image;

        product.set({
            ...dto,
            price: dto.price as number,
            translit: CyrillicToTranslit,
            image: img,
        });

        const result = await product.save();
        return result;
    }

    async getProductByCategory(value: string) {
        const categories = await this.categoriesRepository.findOne({
            where: { translit: value },
        });
        const product = await this.productRepository.findAll({
            where: { idCategory: categories.id },
        });
        return { it: product, title: categories.title, id: categories.id };
    }
}
