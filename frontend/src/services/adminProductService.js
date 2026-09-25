import api from "../api/axios";

export async function getAdminProducts(params = {}) {
  const response = await api.get("/admin/products", {
    params,
  });

  return response.data;
}

export async function getAdminProduct(productId) {
  const response = await api.get(
    `/admin/products/${productId}`
  );

  return response.data;
}

export async function createAdminProduct(productData) {
  const response = await api.post(
    "/admin/products",
    productData
  );

  return response.data;
}

export async function updateAdminProduct(
  productId,
  productData
) {
  const response = await api.put(
    `/admin/products/${productId}`,
    productData
  );

  return response.data;
}

export async function createProductVariant(
  productId,
  variantData
) {
  const response = await api.post(
    `/admin/products/${productId}/variants`,
    variantData
  );

  return response.data;
}

export async function updateProductVariant(
  productId,
  variantId,
  variantData
) {
  const response = await api.put(
    `/admin/products/${productId}/variants/${variantId}`,
    variantData
  );

  return response.data;
}

export async function deactivateProductVariant(
  productId,
  variantId
) {
  const response = await api.delete(
    `/admin/products/${productId}/variants/${variantId}`
  );

  return response.data;
}

export async function uploadProductImage(
  productId,
  imageData
) {
  const formData = new FormData();

  formData.append("image", imageData.image);

  if (imageData.altText) {
    formData.append("alt_text", imageData.altText);
  }
  if (imageData.color) {
    formData.append("color", imageData.color);
   }

  formData.append(
    "is_primary",
    imageData.isPrimary ? "1" : "0"
  );

  formData.append(
    "display_order",
    String(imageData.displayOrder ?? 0)
  );

  const response = await api.post(
    `/admin/products/${productId}/images`,
    formData
  );

  return response.data;
}

export async function setPrimaryProductImage(
  productId,
  imageId
) {
  const response = await api.patch(
    `/admin/products/${productId}/images/${imageId}/primary`
  );

  return response.data;
}

export async function deleteProductImage(
  productId,
  imageId
) {
  const response = await api.delete(
    `/admin/products/${productId}/images/${imageId}`
  );

  return response.data;
}