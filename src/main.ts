import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
// import { ValidationPipe } from './pipes/validation.pipes';
async function bootstrap() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle("shop backend")
        .setDescription("Документация REST API")
        .setVersion("1.0.0")
        .addTag("UserName")
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/api/docs", app, document);

    // app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
bootstrap();
