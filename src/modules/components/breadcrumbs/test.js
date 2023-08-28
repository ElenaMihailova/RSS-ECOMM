import generateBreadcrumbs from './generateBreadcrumbs';

describe('generateBreadcrumbs', () => {
  it('should generate correct HTML for one breadcrumb without href', () => {
    const input = [{ text: 'Home' }];
    const result = generateBreadcrumbs(input);
    const expectedHTML = `
    <nav aria-label="breadcrumbs" class="breadcrumbs container">
      <ol class="breadcrumbs__list">
      <li class="breadcrumbs__link">
        Home
      </li></ol></nav>`;
    expect(result).toEqual(expectedHTML);
  });

  it('should generate correct HTML for one breadcrumb with href', () => {
    const input = [{ text: 'Home', href: '/home' }];
    const result = generateBreadcrumbs(input);
    const expectedHTML = `
    <nav aria-label="breadcrumbs" class="breadcrumbs container">
      <ol class="breadcrumbs__list">
      <li>
        <a class="breadcrumbs__link" href="/home">Home</a>
      </li></ol></nav>`;
    expect(result).toEqual(expectedHTML);
  });

  it('should generate correct HTML for multiple breadcrumbs', () => {
    const input = [{ text: 'Home', href: '/home' }, { text: 'Category', href: '/category' }, { text: 'Product' }];
    const result = generateBreadcrumbs(input);
    const expectedHTML = `
    <nav aria-label="breadcrumbs" class="breadcrumbs container">
      <ol class="breadcrumbs__list">
      <li>
        <a class="breadcrumbs__link" href="/home">Home</a>
      </li>
      <li>/</li>
      <li>
        <a class="breadcrumbs__link" href="/category">Category</a>
      </li>
      <li>/</li>
      <li class="breadcrumbs__link">
        Product
      </li></ol></nav>`;
    expect(result).toEqual(expectedHTML);
  });
});
