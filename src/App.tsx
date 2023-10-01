import { SidePanel } from 'polotno/side-panel';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { Workspace } from 'polotno/canvas/workspace';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';

import { Cursor } from './Components/Cursor';
import { usePartyContext } from './contexts/party';

export const App = () => {
  const { store } = usePartyContext();

  if (!store) return null;

  return (
    <>
      <Cursor x={100} y={100} />
      <PolotnoContainer style={{ width: '100vw', height: '100vh' }}>
        <SidePanelWrap>
          <SidePanel store={store} />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar store={store} downloadButtonEnabled />
          <Workspace store={store} />
          <ZoomButtons store={store} />
        </WorkspaceWrap>
      </PolotnoContainer>
    </>
  );
};

export default App;
