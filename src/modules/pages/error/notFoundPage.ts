export default function NotFoundPage(): string {
  return `
  <section class="error container">
  <div class="error__description">
    <div class="error__404">
      <span><span>4</span></span>
      <span>0</span>
      <span><span>4</span></span>
    </div>
    <p class="error__text titleProstoOne titleProstoOne--big">
      <span>Oops, the kettle was empty!</span> It&nbsp;appears that the page you were looking for was not found.
      It&nbsp;may have been moved or&nbsp;deleted.
      <span>But don&rsquo;t worry, we&nbsp;have plenty of&nbsp;other delicious teas for you to&nbsp;try!</span>
    </p>
    <a href="#" class="button">Go to homepage</a>
  </div>
</section>`;
}
