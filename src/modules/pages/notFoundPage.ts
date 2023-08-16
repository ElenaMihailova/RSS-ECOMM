export default function NotFoundPage(): string {
  return `
  <div class="error container">
  <div class="error__description">
    <p class="error__404 titleProstoOne">404</p>
    <p class="error__text titleProstoOne titleProstoOne--big"> <span>Oops, the kettle was empty!</span>
      It&nbsp;appears that the page you were looking for was not found. It&nbsp;may have been moved or&nbsp;deleted. <span>But don&rsquo;t worry, we&nbsp;have plenty of&nbsp;other delicious teas for you to&nbsp;try!</span></p>
      <a href="#" class="button">Go to homepage</a>
  </div>
</div>`;
}
