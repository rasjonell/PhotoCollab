import { Dispatch, SetStateAction, useState } from 'react';
import { DownloadButton } from 'polotno/toolbar/download-button';

import type { StoreType } from 'polotno/model/store';

import { usePartyContext } from '../../contexts/party';

import './style.css';

type Props = {
  store: StoreType;
};

type ModalProps = {
  room: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const Modal = ({ room, setOpen }: ModalProps) => {
  const [value, setValue] = useState(`${window.location.origin}/app/${room}`);

  const copyLink = () => {
    navigator.clipboard.writeText(value);
    setValue('Copied!');
    setTimeout(() => {
      setValue(`${window.location.origin}/app/${room}`);
    }, 600);
  };

  return (
    <div className="modal-window">
      <div>
        <a title="Close" className="modal-close" onClick={() => setOpen(false)}>
          Close
        </a>
        <h1>Invite Friends!</h1>
        <div>Share the link bellow with friends and start collaborating!</div>
        <br />
        <div>
          <small>Copy and Share 👇</small>
        </div>

        <div className="copy-link">
          <input readOnly type="text" value={value} className="copy-link-input" />
          <button type="button" className="copy-link-button" onClick={copyLink}>
            <span>🔗</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const ActionButtons = ({ store }: Props) => {
  const { room } = usePartyContext();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <DownloadButton store={store} />
      <button className="invite-btn" onClick={() => setOpen(true)}>
        Invite
      </button>
      {open ? <Modal room={room} setOpen={setOpen} /> : null}
    </div>
  );
};
