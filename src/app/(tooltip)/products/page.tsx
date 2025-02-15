import { readFileSync } from "fs";
import { resolve } from "path";
import { ProductResponse } from "../../../../product";

const productPath = resolve(process.cwd(), "mock", "product.json");
const productsInfo = JSON.parse(
  readFileSync(productPath).toString()
) as ProductResponse;

export default async function ProductionPage() {
  return (
    <>
      <h2>当前时间：{Date()}</h2>
      <h2>总产品数{productsInfo.total}</h2>
      <h2>当前产品数量：{productsInfo.limit}</h2>
      {productsInfo.products.map((product) => {
        return (
          <ul key={product.id}>
            <li>ID:{product.id}</li>
            <li>分类{product.category}</li>
            <li>品牌:{product.brand}</li>
            <li>价格:{product.price}</li>
          </ul>
        );
      })}
    </>
  );
}
