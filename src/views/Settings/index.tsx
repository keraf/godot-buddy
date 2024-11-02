import { useState, useEffect, useCallback } from 'react';
import { t } from 'i18next';
import { getVersion } from '@tauri-apps/api/app';
import { check } from '@tauri-apps/plugin-updater';
import { enable, isEnabled, disable } from '@tauri-apps/plugin-autostart';
import { Button, Fieldset, rem, useMantineColorScheme } from '@mantine/core';

import Content from '@/components/Content';
import Header from '@/components/Header';
import SwitchSettingsInput from '@/components/SettingsInput/SwitchSettingsInput';
import SelectSettingsInput from '@/components/SettingsInput/SelectSettingsInput';
import FileSettingsInput from '@/components/SettingsInput/FileSettingsInput';
import SettingsInput from '@/components/SettingsInput';

const Settings = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [isAutoStart, setIsAutoStart] = useState<boolean>(false);
  const [version, setVersion] = useState('');

  useEffect(() => {
    getVersion().then(setVersion);
    isEnabled().then(setIsAutoStart);
  }, []);

  const toggleAutoStart = useCallback(async () => {
    if (isAutoStart) {
      await disable();
    } else {
      await enable();
    }

    setIsAutoStart(!isAutoStart);
  }, [isAutoStart]);

  return (
    <>
      <Header title={t('Settings.Title')} />
      <Content>
        {/* Project Settings */}
        <Fieldset
          legend={t('Settings.ProjectsTitle')}
          mb="md"
          py={0}
          styles={{ legend: { fontSize: rem(20) } }}
        >
          <SelectSettingsInput
            name="projectDoubleClickAction"
            label={t('Settings.ProjectDoubleClickActionTitle')}
            description={t('Settings.ProjectDoubleClickActionDesc')}
            data={[
              { label: 'Edit', value: 'edit' },
              { label: 'Run', value: 'run' },
            ]}
          />
        </Fieldset>
        {/* Versions Settings */}
        <Fieldset
          legend={t('Settings.VersionsTitle')}
          mb="md"
          py={0}
          styles={{ legend: { fontSize: rem(20) } }}
        >
          <FileSettingsInput
            name="engineDefaultInstallPath"
            label={t('Settings.EngineDefaultInstallPathTitle')}
            description={t('Settings.EngineDefaultInstallPathDesc')}
            isDirectory
          />
        </Fieldset>
        {/* General settings */}
        <Fieldset
          legend={t('Settings.GeneralTitle')}
          mb="md"
          py={0}
          styles={{ legend: { fontSize: rem(20) } }}
        >
          <SwitchSettingsInput
            name="autoStart"
            label={t('Settings.AutoStartTitle')}
            description={t('Settings.AutoStartDesc')}
            value={isAutoStart}
            onChange={toggleAutoStart}
            save={false}
          />
          <SwitchSettingsInput
            name="autoStart"
            label={t('Settings.DarkModeTitle')}
            description={t('Settings.DarkModeDesc')}
            value={colorScheme === 'dark'}
            onChange={toggleColorScheme}
            save={false}
          />
          {/* TODO */}
          <SettingsInput label="Godot Buddy version" description={version}>
            <Button onClick={() => check()}>Check for updates</Button>
          </SettingsInput>
        </Fieldset>
      </Content>
    </>
  );
};

export default Settings;
