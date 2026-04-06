/* 声明 SCSS 文件的类型 */
declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}
