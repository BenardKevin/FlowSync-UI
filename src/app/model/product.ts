import { Category } from "./category";

interface Product {
    id: number,
    name: String,
    price: number,
    category: Category
}

export type { Product }