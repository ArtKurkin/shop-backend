import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Orders } from "./orders.model";
import { Cart } from "src/carts/carts.model";
import { ProductOrders } from "./products-orders";
import { ProductCart } from "src/carts/products-carts.model";
import { AuthService } from "src/auth/auth.service";
import { Product } from "src/products/products.model";

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Orders) private orderRepository: typeof Orders,
        @InjectModel(ProductOrders)
        private productOrdersRepository: typeof ProductOrders,
        @InjectModel(Cart) private cartRepository: typeof Cart,
        @InjectModel(ProductCart)
        private productCartRepository: typeof ProductCart,
        @InjectModel(Product)
        private productRepository: typeof Product,
        private authService: AuthService
    ) {}

    async getOrders(accessToken) {
        if (!accessToken) {
            throw new UnauthorizedException({
                message: "Пользователь с таким email не найден",
            });
        }
        const bearer = accessToken.split(" ")[0];
        const token = accessToken.split(" ")[1];

        const userData = this.authService.validateRefreshToken(token);

        const orders = await this.orderRepository.findAll({
            where: { id_user: userData.id },
            include: { all: true },
        });

        return orders;
    }

    async createOrder({ cartId }, headers) {
        const cart = await this.cartRepository.findOne({
            where: { id: cartId },
            include: { all: true },
        });

        // const totalPrice = cart.dataValues.products?.reduce(
        //     (sum: number, item) =>
        //         sum + item.dataValues.price * item.dataValues.quantity,
        //     0
        // );

        const order = await this.orderRepository.create({
            id_user: cart.dataValues.id_user,
        });

        await cart.dataValues.products.forEach(
            async (item: any, index, arr) => {
                await this.productOrdersRepository.create({
                    id_order: order.id,
                    id_product: item.id,
                    quantity: item.ProductCart.dataValues.quantity,
                    price: item.price,
                });

                const product = await this.productRepository.findOne({
                    where: { id: item.id },
                });

                if (product.quantity <= item.ProductCart.dataValues.quantity) {
                    await product.set({
                        quantity: 0,
                    });
                } else {
                    await product.set({
                        quantity:
                            product.quantity -
                            item.ProductCart.dataValues.quantity,
                    });
                }
                await product.save();
            }
        );

        await cart.dataValues.products.forEach(async (item, index, arr) => {
            await this.productCartRepository.destroy({
                where: { id_product: item.id, id_cart: cart.dataValues.id },
            });
        });
    }
}
