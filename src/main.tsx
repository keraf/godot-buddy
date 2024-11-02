import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createTheme, MantineProvider } from '@mantine/core';

import App from './App';
import { store } from './store';
import './i18n';

import '@mantine/core/styles.css';

document.addEventListener('contextmenu', (event) => event.preventDefault());

const theme = createTheme({
  colors: {
    myColor: [
      '#eef3ff',
      '#dce4f5',
      '#b9c7e2',
      '#94a8d0',
      '#748dc1',
      '#5f7cb8',
      '#5474b4',
      '#44639f',
      '#39588f',
      '#2d4b81',
    ],
  },
  cursorType: 'pointer',
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
