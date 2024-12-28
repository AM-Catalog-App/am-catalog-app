const PRODUCT_DETAIL_EXCEL_COLUMN_NAMES = [
  "sr no.",
  "product name",
  "size",
  "style code",
  "colour",
  "quantity",
  "location",
  "barcode",
  "tag",
  "description",
  "collection",
  "category",
  "mrp",
  "imageUrls",
];

const BOTTOM_NAVIGATION_VALUES = {
  admin: "admin",
  uploadCatalog: "admin",
  catalog: "catalog",
  updateCategory: "admin",
  category: "catalog",
  ["product-detail"]: "catalog",
  ["admin-product-detail"]: "catalog",
  ["out-of-stock"]: "out-of-stock"
}

export { PRODUCT_DETAIL_EXCEL_COLUMN_NAMES, BOTTOM_NAVIGATION_VALUES };
