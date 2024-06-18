import { ApiProperty } from "@nestjs/swagger";
import {
    Model,
    Column,
    DataType,
    Table,
    BelongsToMany,
    BelongsTo,
    ForeignKey,
} from "sequelize-typescript";
import { Cart } from "src/carts/carts.model";
import { ProductCart } from "src/carts/products-carts.model";
import { Categories } from "src/categories/categories.model";
import { Orders } from "src/orders/orders.model";
import { ProductOrders } from "src/orders/products-orders";
interface ProductCreationAttrs {
    title: string;
    description: string;
    image: string;
    price: number;
    quantity: number;
    idCategory: number;
    translit: string;
}

@Table({ tableName: "products" })
export class Product extends Model<Product, ProductCreationAttrs> {
    @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({
        example: "Рубашка мужская",
        description: "Название товара",
    })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    title: string;

    @ApiProperty({
        example: "Рубашка мужская, зеленого цвета",
        description: "Описание роли",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    description: string;

    @ApiProperty({ example: "1000", description: "Цена товара" })
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    })
    price: number;

    @ApiProperty({ example: "5", description: "Количество товара" })
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: 1,
    })
    quantity: number;

    @ApiProperty({ example: "img1.webp", description: "Название изображения" })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    image: string;

    @ApiProperty({ example: "1", description: "Id связной категории" })
    @ForeignKey(() => Categories)
    @Column({ type: DataType.INTEGER, allowNull: false })
    idCategory: number;

    @ApiProperty({ example: "obuv", description: "Транслитерация названия" })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    translit: string;

    @BelongsTo(() => Categories)
    category: Categories;

    @BelongsToMany(() => Cart, () => ProductCart)
    carts: Cart[];

    @BelongsToMany(() => Orders, () => ProductOrders)
    orders: Orders[];
}
