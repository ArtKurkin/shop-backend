import { ApiProperty } from "@nestjs/swagger";
import {
    Model,
    Column,
    DataType,
    Table,
    ForeignKey,
} from "sequelize-typescript";
import { Product } from "src/products/products.model";
import { Orders } from "./orders.model";

interface ProductOrdersCreationAttrs {
    id_order: number;
    id_product: number;
    quantity: number;
    price: number;
}

@Table({ tableName: "products_orders" })
export class ProductOrders extends Model<
    ProductOrders,
    ProductOrdersCreationAttrs
> {
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

    @ForeignKey(() => Orders)
    @Column({
        type: DataType.INTEGER,
    })
    id_order: number;

    @Column({
        type: DataType.INTEGER,
    })
    price: number;
}
