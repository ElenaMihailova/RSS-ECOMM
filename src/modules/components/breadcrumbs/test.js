import generateBreadcrumbs from './generateBreadcrumbs';

describe('generateBreadcrumbs', () => {
  it('should generate the breadcrumbs element with the correct structure', () => {
    const breadcrumbs = generateBreadcrumbs();

    expect(breadcrumbs).toBeInstanceOf(HTMLElement);

    expect(breadcrumbs.tagName).toBe('NAV');
    expect(breadcrumbs.getAttribute('aria-label')).toBe('breadcrumbs');

    const breadcrumbsList = breadcrumbs.querySelector('.breadcrumbs__list');
    expect(breadcrumbsList).toBeTruthy();

    const homeItem = breadcrumbsList.querySelector('.breadcrumbs__link');
    expect(homeItem).toBeTruthy();

    const catalogItem = breadcrumbsList.querySelectorAll('.breadcrumbs__link')[1];
    expect(catalogItem).toBeTruthy();
  });
});
