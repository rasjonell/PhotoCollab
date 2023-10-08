import { SidePanel } from 'polotno/side-panel';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { Workspace } from 'polotno/canvas/workspace';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';

import { Cursor } from '../components/Cursor';
import { usePartyContext } from '../contexts/party';

const App = () => {
  const { store, cursorPos } = usePartyContext();

  if (!store) return null;

  return (
    <>
      {[...cursorPos.entries()].map(([id, { x, y }]) => (
        <Cursor x={x} y={y} key={id} />
      ))}

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
