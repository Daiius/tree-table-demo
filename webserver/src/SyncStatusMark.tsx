import React from 'react';

import { SyncStatus } from './useAutoSyncCell';

import './SyncStatusMark.scss';

export type SyncStatusMarkProps = {
  syncStatus: SyncStatus;
}

const UpdatingMark = () => <i className="bi bi-arrow-repeat sync-status-mark" />;
const UpdatedMark = () => <i className="bi bi-check-circle sync-status-mark" />;
const ErrorMark = () => <i className="bi bi-exclamation-triangle sync-status-mark" />;

const SyncStatusMark: React.FC<SyncStatusMarkProps> = ({
  syncStatus
}) => {
  switch (syncStatus) {
    case "OK":
      return null;
    case "Updating":
      return <UpdatingMark />;
    case "Updated":
      return <UpdatedMark />;
    case "Error":
      return <ErrorMark />;
  }
};

export default SyncStatusMark;

