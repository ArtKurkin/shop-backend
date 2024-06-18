import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { AuthService } from "src/auth/auth.service";
import { Cart } from "./carts.model";
import { ProductCart } from "./products-carts.model";

@Injectable()
export class CartsService {
    constructor(
        private authService: AuthService,
        @InjectModel(Cart) private cartRepository: typeof Cart,
        @InjectModel(ProductCart)
        private productCartRepository: typeof ProductCart // @InjectModel(User) private userRepository: typeof User
    ) {}

    async increaseProduct(body: any, accessToken: any) {
        if (!accessToken) {
            throw new UnauthorizedException({
                message: "Пользователь с таким email не найден",
            });
        }
        const bearer = accessToken.split(" ")[0];
        const token = accessToken.split(" ")[1];

        const userData = this.authService.validateRefreshToken(token);

        if (!userData) {
            throw new UnauthorizedException({
                message: "Пользователь с таким email не найден",
            });
        }
        // const user = await this.userRepository.findOne({
        //     where: { id: userData.id },
        // });
        const cart = await this.cartRepository.findOne({
            where: { id_user: userData.id },
            include: { all: true },
        });

        if (cart == null) {
            throw new UnauthorizedException({
                message: "Корзина пуста",
            });
        }

        const productInCart = await this.productCartRepository.findOne({
            where: { id_cart: cart.id, id_product: body.idProduct },
        });
        if (productInCart) {
            productInCart.set({
                quantity: productInCart.quantity + 1,
            });
            return await productInCart.save();
            //productInCart.save();
        }
    }

    async decreaseProduct(body: any, accessToken: any) {
        if (!accessToken) {
            throw new UnauthorizedException({
                message: "Пользователь с таким email не найден",
            });
        }
        const bearer = accessToken.split(" ")[0];
        const token = accessToken.split(" ")[1];

        const userData = this.authService.validateRefreshToken(token);

        if (!userData) {
            throw new UnauthorizedException({
                message: "Пользователь с таким email не найден",
            });
        }
        // const user = await this.userRepository.findOne({
        //     where: { id: userData.id },
        // });
        const cart = await this.cartRepository.findOne({
            where: { id_user: userData.id },
            include: { all: true },
        });

        if (cart == null) {
            throw new UnauthorizedException({
                message: "Корзина пуста",
            });
        }

        const productInCart = await this.productCartRepository.findOne({
            where: { id_cart: cart.id, id_product: body.idProduct },
        });
        if (productInCart) {
            productInCart.set({
                quantity:
                    productInCart.quantity == 1
                        ? productInCart.quantity
                        : productInCart.quantity - 1,
            });
            return await productInCart.save();
            //productInCart.save();
        }
    }

    async deleteFromCart(body: any, accessToken: any) {
        if (!accessToken) {
            throw new UnauthorizedException({
                message: "Пользователь с таким email не найден",
            });
        }
        const bearer = accessToken.split(" ")[0];
        const token = accessToken.split(" ")[1];

        const userData = this.authService.validateRefreshToken(token);

        if (!userData) {
            throw new UnauthorizedException({
                message: "Пользователь с таким email не найден",
            });
        }
        // const user = await this.userRepository.findOne({
        //     where: { id: userData.id },
        // });
        const cart = await this.cartRepository.findOne({
            where: { id_user: userData.id },
            include: { all: true },
        });

        if (cart == null) {
            throw new UnauthorizedException({
                message: "Корзина пуста",
            });
        }

        const productInCart = await this.productCartRepository.findOne({
            where: { id_cart: cart.id, id_product: body.idProduct },
        });

        if (productInCart) {
            await productInCart.destroy();
            //productInCart.save();
        }
        // const tokens = this.generateTokens(user);
        // await this.userService.saveToken(user.id, tokens.refreshToken);
        //return cart;
    }

    async getCart(accessToken) {
        if (!accessToken) {
            throw new UnauthorizedException({
                message: "Пользователь с таким email не найден",
            });
        }
        const bearer = accessToken.split(" ")[0];
        const token = accessToken.split(" ")[1];

        const userData = this.authService.validateRefreshToken(token);

        if (!userData) {
            throw new UnauthorizedException({
                message: "Пользователь с таким email не найден",
            });
        }
        // const user = await this.userRepository.findOne({
        //     where: { id: userData.id },
        // });
        const cart = await this.cartRepository.findOne({
            where: { id_user: userData.id },
            include: { all: true },
        });

        if (cart == null) {
            throw new UnauthorizedException({
                message: "Корзина пуста",
            });
        }
        // const tokens = this.generateTokens(user);
        // await this.userService.saveToken(user.id, tokens.refreshToken);
        return cart;
    }

    async addInCart(idProduct: number, accessToken) {
        const cartUser = await this.getCart(accessToken);
        const cart = await this.productCartRepository.create(
            {
                id_product: idProduct,
                id_cart: cartUser.id,
                quantity: 1,
            },
            { include: { all: true } }
        );
        return cart;
    }
}
