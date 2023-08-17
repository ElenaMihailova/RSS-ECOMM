import Main from '../main/main';
import RegistrationView from '../pages/registration/registrationView';

class App {
  private static container: HTMLElement = document.body;

  public main: Main | null;

  constructor() {
    this.main = null;
    this.createView();
  }

  private createView(): void {
    this.main = new Main();
    App.container.append(this.main.render());
    this.main.setContent(new RegistrationView());
  }
}

export default App;
