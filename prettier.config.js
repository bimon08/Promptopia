// prettier.config.js
module.exports = {
  plugins: ["prettier-plugin-tailwindcss"],
  importOrder: ["^@component/(.*)$", "^@src/(.*)$", "^@shared/(.*)$", "^[./]"],
  tabWidth: 2,
  trailingComma: "es5",
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
};
