import React from 'react';

import { SyncStatus } from './useAutoSyncCell';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import './SyncStatusMark.scss';

export type SyncStatusMarkProps = {
  syncStatus: SyncStatus;
  errorMessage?: string;
}

const UpdatingMark: React.FC = () => <i className="bi bi-arrow-repeat sync-status-mark" />;
const UpdatedMark: React.FC = () => <i className="bi bi-check-circle sync-status-mark" />;
const ErrorMark: React.FC = () => <i className="bi bi-exclamation-triangle sync-status-mark" />;


const SyncStatusMark: React.FC<SyncStatusMarkProps> = ({
  syncStatus,
  errorMessage,
}) => {

  let Mark: React.FC|null = null;

  switch (syncStatus) {
    case "OK":
      Mark = null;
      break;
    case "Updating":
      Mark = UpdatingMark;
      break;
    case "Updated":
      Mark = UpdatedMark;
      break;
    case "Error":
      Mark = ErrorMark;
      break;
  }

  if (Mark == null) return null;

  return (
    <OverlayTrigger
      trigger={["hover", "click"]}
      overlay={
        <Popover className="sync-status-mark-popover">
          <pre>{errorMessage}</pre>
        </Popover>
      }
    >
      {/* https://github.com/react-bootstrap/react-bootstrap/issues/2208#issuecomment-301737531 */}
      {/* we need <div> or <span> to use overlay...?? */}
      <div>
        <Mark />
      </div>
    </OverlayTrigger>
  );
};

export default SyncStatusMark;

