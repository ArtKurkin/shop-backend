import { ApiProperty } from "@nestjs/swagger";
import {
    Model,
    Column,
    DataType,
    Table,
    BelongsToMany,
} from "sequelize-typescript";
import { Product } from "src/products/products.model";
import { ProductCart } from "./products-carts.model";

interface CartCreationAttrs {
    id_user: number;
}

@Table({ tableName: "carts" })
export class Cart extends Model<Cart, CartCreationAttrs> {
    @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: "1", description: "ID пользователя" })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        allowNull: false,
    })
    id_user: number;

    @BelongsToMany(() => Product, () => ProductCart)
    products: Product[];
}
