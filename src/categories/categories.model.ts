import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Product } from "src/products/products.model";

interface CategoriesCreationAttrs {
    title: string;
    idParent: number;
    translit: string;
    image: string;
}

@Table({ tableName: "categories" })
export class Categories extends Model<Categories, CategoriesCreationAttrs> {
    @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: "Обувь", description: "Название категории" })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    title: string;

    @ApiProperty({ example: "2", description: "Идентификатор родителя" })
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    idParent: number;

    @ApiProperty({ example: "obuv", description: "Транслитерация названия" })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    translit: string;

    @ApiProperty({ example: "img1.webp", description: "Название изображения" })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    image: string;

    @HasMany(() => Product)
    products: Product[];
}
