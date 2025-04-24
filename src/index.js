import ReactDOM from 'react-dom/client';
// import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import Capture from './Capture';

const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);
root.render(<Capture />);
// serviceWorkerRegistration.register();
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
          console.error('ServiceWorker registration failed: ', error);
        });
    });
}

