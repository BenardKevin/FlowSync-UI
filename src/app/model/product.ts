import { Category } from "./category";
import { Supplier } from "./supplier";

interface Product {
    id: number,
    name: string,
    price: number,
    vat: number,
    category: Category,
    supplier: Supplier
}

export type { Product }