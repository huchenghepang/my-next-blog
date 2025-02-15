import { readFileSync } from "fs";
import { resolve } from "path";

export function GET(){
    const productPath = resolve(process.cwd(), "mock", "product.json")
    const data = readFileSync(productPath)
    return new Response(data)
}