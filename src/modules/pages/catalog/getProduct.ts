import { ProductProjection } from '@commercetools/platform-sdk';
import { getCategoryName, getProductByProductUrl } from '../../api/apiClient';
import { ProductData } from '../../../types/interfaces';

export const getProductCategoryName = async (id: string): Promise<string> => {
  const categoryName = await getCategoryName(id);
  return categoryName;
};

export const getProduct = async (link: string): Promise<ProductData> => {
  const response = await getProductByProductUrl(link);

  const product = response as ProductProjection;

  const price =
    product.masterVariant.prices && product.masterVariant.prices[0]
      ? product.masterVariant.prices[0].value.centAmount / 100
      : 0;

  const description = product.description && product.description['en-US'] ? product.description['en-US'] : '';

  const imageURL =
    product.masterVariant.images && product.masterVariant.images.length > 0 ? product.masterVariant.images[0].url : '';

  const categories: string[] = [];

  for await (const category of product.categories) {
    const { id } = category;
    const categoryName = await getProductCategoryName(id);
    categories.push(categoryName);
  }

  const productData: ProductData = {
    link: product.slug['en-US'],
    title: product.name['en-US'],
    price,
    categories,
    description,
    imageURL,
    details: product.masterVariant.attributes,
  };

  console.log(productData);

  return productData;
};
