import { ApiProperty } from "@nestjs/swagger";
import {
    Model,
    Column,
    DataType,
    Table,
    BelongsToMany,
} from "sequelize-typescript";
import { Product } from "src/products/products.model";
import { ProductOrders } from "./products-orders";

interface OrdersCreationAttrs {
    id_user: number;
}

@Table({ tableName: "orders" })
export class Orders extends Model<Orders, OrdersCreationAttrs> {
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
        allowNull: false,
    })
    id_user: number;

    @BelongsToMany(() => Product, () => ProductOrders)
    products: Product[];
}
