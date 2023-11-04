import createStore from 'polotno/model/store';
import { useNavigate, useParams } from 'react-router-dom';

import App from './App';
import { useJoinRoom } from '../API';
import { PartyContextProvider } from '../contexts/party';

const store = createStore({
  showCredit: false,
  key: import.meta.env.VITE_POLOTNO_KEY,
});

const Room = () => {
  const { room } = useParams();
  const navigate = useNavigate();

  if (!room) {
    navigate('/error');
    return null;
  }

  const { isLoading, isError, data } = useJoinRoom(room);

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
    <PartyContextProvider store={store} room={room!}>
      <App />
    </PartyContextProvider>
  );
};

export default Room;
