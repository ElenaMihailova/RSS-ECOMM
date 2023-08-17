interface MainData {
  title: string;
  content: string;
}

export default function renderMain(mainData: MainData): void {
  const main = document.createElement('main');
  main.innerHTML = `
	<h1 class="visually-hidden">${mainData.title}</h1>
	${mainData.content}
`;

  const footer = document.querySelector('footer');
  if (footer && footer.parentNode) {
    footer.parentNode.insertBefore(main, footer);
  } else {
    document.body.appendChild(main);
  }
}
