export class CreateUserDto {
    // @ApiProperty({ example: "user@mail.ru", description: "Почтовый адрес" })
    // @IsString({ message: "Должно быть строкой" })
    // @IsEmail({}, { message: "Некорректный адрес" })
    readonly email: string;

    // @ApiProperty({ example: "1234", description: "Пароль" })
    // @IsString({ message: "Должно быть строкой" })
    // @Length(4, 16, { message: "Не меньше 4 и не больше 16" })
    readonly password: string;
}
