import AppUI from './AppUI';
import AuthUI from './AuthUI';

class App {
  static init() {
    AppUI.render();
    AuthUI.render();
  }
}

export default App;
