
import { render } from './vnode/vnode';
import App from './App';

const rootElement = document.getElementById('root');
render(App(), rootElement);