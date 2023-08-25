export default function setupMenuToggle(menuButtonId: string, menuId: string): void {
  const menuButton = document.getElementById(menuButtonId) as HTMLInputElement | null;
  const menu = document.getElementById(menuId);

  const toggleMenuDisplay = (): void => {
    if (menu && (menu.style.display === 'none' || menu.style.display === '')) {
      menu.style.display = 'flex';
    } else {
      if (menu) {
        menu.style.display = 'none';
      }
      if (menuButton && 'checked' in menuButton) {
        menuButton.checked = false;
      }
    }
  };

  if (menuButton && menu) {
    menuButton.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenuDisplay();
    });

    menu.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenuDisplay();
    });

    document.addEventListener('click', () => {
      if (menu && menu.style.display === 'flex') {
        toggleMenuDisplay();
      }
    });
  }
}
