import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as uuid from "uuid";
import * as path from "path";
import * as fs from "fs";
const sharp = require("sharp");

@Injectable()
export class FilesService {
    async createFile(file): Promise<string> {
        try {
            const fileName = uuid.v4() + ".webp";
            const filePath = path.resolve(__dirname, "..", "..", "static");
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }
            // fs.writeFileSync(path.join(filePath, fileName), file.buffer);
            await sharp(file.buffer)
                .webp({ effort: 3, quality: 90 })
                .toFile(path.join(filePath, fileName));
            return fileName;
        } catch (e) {
            throw new HttpException(
                "Произошла ошибка при записи файла",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
