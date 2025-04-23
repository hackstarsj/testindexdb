import ReactDOM from 'react-dom/client';
// import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import Capture from './Capture';

const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);
root.render(<Capture />);
serviceWorkerRegistration.register();
