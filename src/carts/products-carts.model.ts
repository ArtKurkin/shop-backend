import { ApiProperty } from "@nestjs/swagger";
import {
    Model,
    Column,
    DataType,
    Table,
    ForeignKey,
} from "sequelize-typescript";
import { Product } from "src/products/products.model";
import { Cart } from "./carts.model";

interface ProductCartCreationAttrs {
    id_product: number;
    id_cart: number;
    quantity: number;
}

@Table({ tableName: "products_carts" })
export class ProductCart extends Model<ProductCart, ProductCartCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: "0",
    })
    quantity: number;

    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
    })
    id_product: number;

    @ForeignKey(() => Cart)
    @Column({
        type: DataType.INTEGER,
    })
    id_cart: number;
}
