import { ObjectId } from "../../depts.ts";

export interface Producto{
    _id: ObjectId;
    code: number,
    title: string,
    price: number,
    thumbnail: string,
    timestamp: string,
    description: string,
    stock: number
}