import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table } from "sequelize-typescript";

interface UserCreationAttrs {
    email: string;
    password: string;
    roles: string;
}

@Table({ tableName: "users" })
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: "user@mail.ru", description: "Почтовый адрес" })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    email: string;

    @ApiProperty({ example: "USER", description: "Роль" })
    @Column({
        type: DataType.STRING,
    })
    roles: string;

    @ApiProperty({
        example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFydC5jdXJraW5AZ21haWwuY29tIiwiaWQiOjEsInJvbGVzIjoiVVNFUiIsImlhdCI6MTcwMDY1MjQxMywiZXhwIjoxNzAwNzM4ODEzfQ.mkB8-4DocMbvyrWBrzbtDgO-aFtMH6cA74S1HbdYwmU",
        description: "Refresh token",
    })
    @Column({
        type: DataType.STRING,
    })
    refreshToken: string;

    @ApiProperty({ example: "1234", description: "Пароль" })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;
}
