import { useCallback, useMemo } from 'react';
import { t } from 'i18next';
import { Modal } from '@mantine/core';

import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { hideModal } from '@/slices/modalSlice';

import AddProject from '@/modals/AddProject';
import NewProject from '@/modals/NewProject';
import RemoveProject from '@/modals/RemoveProject';
import InstallEngine from '@/modals/InstallEngine';

const Modals = () => {
  const dispatch = useAppDispatch();
  const { show, data } = useAppSelector((state) => state.modals);

  const title = useMemo(() => {
    switch (data?.name) {
      case 'project-add':
        return t('Modals.ProjectAddTitle');
      case 'project-remove':
        return t('Modals.ProjectRemoveTitle');
      case 'project-new':
        return t('Modals.ProjectNewTitle');
      case 'engine-install':
        return t('Modals.EngineInstallTitle');
    }
  }, [data?.name]);

  const close = useCallback(() => dispatch(hideModal()), []);
  const body = useMemo(() => {
    switch (data?.name) {
      case 'project-add':
        return <AddProject {...data.params} close={close} />;
      case 'project-remove':
        return <RemoveProject {...data.params} close={close} />;
      case 'project-new':
        return <NewProject close={close} />;
      case 'engine-install':
        return <InstallEngine {...data.params} close={close} />;
      default:
        return;
    }
  }, [data]);

  if (!show || !data) {
    return;
  }

  return (
    <Modal opened onClose={close} title={title}>
      {body}
    </Modal>
  );
};

export default Modals;
