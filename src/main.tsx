import React from 'react';
import ReactDOM from 'react-dom/client';
import createStore from 'polotno/model/store';

import App from './App.tsx';
import { PartyContextProvider } from './contexts/party.tsx';

const store = createStore({
  showCredit: false,
  key: import.meta.env.VITE_POLOTNO_KEY,
});

store.addPage();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PartyContextProvider store={store}>
      <App />
    </PartyContextProvider>
  </React.StrictMode>,
);
