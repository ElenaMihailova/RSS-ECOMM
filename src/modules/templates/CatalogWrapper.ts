import generateCatalogList from '../components/catalogList/generateCatalogList';

const myProductData = [
  { image: 'path/to/image1.jpg', title: 'Продукт 1', price: 1000, link: '#' },
  { image: 'path/to/image2.jpg', title: 'Продукт 2', price: 2000, link: '#' },
  { image: 'path/to/image3.jpg', title: 'Продукт 3', price: 3000, link: '#' },
];

const catalogList = generateCatalogList(myProductData);

const catalogWrapper = `
<section class="catalog__wrap container">
  <div class="catalog__filter filter">здесь блок c фильтрами</div>
  <div class="catalog__sort sorting">здесь блок c сортировкой</div>
  <div class="catalog__items">
  ${catalogList}
  <div>  
</section>
`;

export default catalogWrapper;
