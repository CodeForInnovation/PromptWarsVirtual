import { render } from 'preact';
import App from './App';
import './index.css';

render(<App />, document.getElementById('app') as HTMLElement);

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((err) => {
      console.error('SW registration failed: ', err);
    });
  });
}
