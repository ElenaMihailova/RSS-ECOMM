import { ProductProjection } from '@commercetools/platform-sdk';
import { getCategoryName, getProductByProductUrl } from '../../api/apiCatalog';
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

  const discount =
    product.masterVariant.prices && product.masterVariant.prices[0] && product.masterVariant.prices[0].discounted
      ? product.masterVariant.prices[0].discounted.value.centAmount / 100
      : price;

  const description = product.description && product.description['en-US'] ? product.description['en-US'] : '';

  const categories: string[] = [];

  const imageURLs: string[] = [];

  if (product.masterVariant.images) {
    product.masterVariant.images.forEach((image) => {
      imageURLs.push(image.url);
    });
  }

  for await (const category of product.categories) {
    const { id } = category;
    const categoryName = await getProductCategoryName(id);
    categories.push(categoryName);
  }

  const productData: ProductData = {
    link: product.slug['en-US'],
    title: product.name['en-US'],
    price,
    discount,
    categories,
    description,
    imageURLs,
    details: product.masterVariant.attributes,
  };

  return productData;
};
