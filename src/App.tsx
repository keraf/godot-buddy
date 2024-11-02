import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useMantineColorScheme } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';

import Layout from './components/Layout';
import Router from './components/Router';
import Modals from './components/Modals';

import { useAppDispatch } from './hooks/useRedux';
import {
  addInstalledVersion,
  setAvailableVersions,
  setInstalledVersions,
} from './slices/versionSlice';
import { setProjects } from './slices/projectSlice';
import {
  removeDownload,
  setDownloadFinished,
  setDownloadProgress,
  setDownloadStart,
} from './slices/downloadSlice';
import { setInitialSettings, Settings } from './slices/settingSlice';

import type {
  DownloadFinished,
  DownloadProgress,
  DownloadStart,
  Engine,
  Project,
  Version,
} from './tauri';

import './App.css';

const App = () => {
  const dispatch = useAppDispatch();
  const { toggleColorScheme } = useMantineColorScheme();

  /* Initial calls + event listeners */
  useEffect(() => {
    invoke<Settings>('settings_get').then((resp) => {
      dispatch(setInitialSettings(resp));
    });

    invoke<Version[]>('versions_get_available').then((resp) =>
      dispatch(setAvailableVersions(resp))
    );

    invoke<Engine[]>('versions_get_installed').then((resp) =>
      dispatch(setInstalledVersions(resp))
    );

    invoke<Project[]>('projects_get').then((resp) =>
      dispatch(setProjects(resp))
    );

    // Downloads
    listen<DownloadStart>('download-start', (event) => {
      dispatch(setDownloadStart(event.payload));
    });

    listen<DownloadProgress>('download-progress', (event) => {
      dispatch(setDownloadProgress(event.payload));
    });

    listen<DownloadFinished>('download-finished', (event) => {
      dispatch(setDownloadFinished(event.payload));
    });

    // Engine
    listen<Engine>('engine-installed', (event) => {
      dispatch(removeDownload(event.payload.key));
      dispatch(addInstalledVersion(event.payload));
    });
  }, []);

  useHotkeys([['mod+J', toggleColorScheme]]);

  return (
    <Layout>
      <>
        <Router />
        <Modals />
      </>
    </Layout>
  );
};

export default App;
