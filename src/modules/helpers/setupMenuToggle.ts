export default function setupMenuToggle(menuButtonId: string, menuId: string): void {
  const menuButton = document.getElementById(menuButtonId);
  const menu = document.getElementById(menuId);

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = 'flex';
      } else {
        menu.style.display = 'none';
      }
    });
  }
}
