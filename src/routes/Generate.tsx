import createStore from 'polotno/model/store';
import { useNavigate } from 'react-router-dom';

import App from './App';
import { useGenerateAndJoinRoom } from '../API';
import { PartyContextProvider } from '../contexts/party';

const store = createStore({
  showCredit: false,
  key: import.meta.env.VITE_POLOTNO_KEY,
});

store.addPage();

const Generate = () => {
  const navigate = useNavigate();
  const { data, isError, isLoading } = useGenerateAndJoinRoom();

  if (isLoading) {
    return (
      <div className="container">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (isError || !data) {
    navigate('/error');
    return null;
  }

  return (
    <PartyContextProvider store={store} room={data.room}>
      <App />
    </PartyContextProvider>
  );
};

export default Generate;
