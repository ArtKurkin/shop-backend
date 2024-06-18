export class CreateProduct {
    readonly id: number;
    readonly title: string;
    readonly description: string;
    readonly image?: string;
    readonly price: number;
    readonly quantity: number;
    readonly idCategory: number;
}
