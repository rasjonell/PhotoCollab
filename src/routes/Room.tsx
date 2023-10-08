import { useParams } from 'react-router-dom';
import createStore from 'polotno/model/store';

import { PartyContextProvider } from '../contexts/party';

import App from './App';

const store = createStore({
  showCredit: false,
  key: import.meta.env.VITE_POLOTNO_KEY,
});

store.addPage();

const Room = () => {
  const { room } = useParams();

  return (
    <PartyContextProvider store={store} room={room!}>
      <App />
    </PartyContextProvider>
  );
};

export default Room;
