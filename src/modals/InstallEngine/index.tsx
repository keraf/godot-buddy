import { useCallback, useState } from 'react';
import { t } from 'i18next';
import { invoke } from '@tauri-apps/api/core';
import { Button, Group, SegmentedControl, Text, Stack } from '@mantine/core';
import { useAppSelector } from '@/hooks/useRedux.ts';
import { pathJoin } from '@/utils/file';
import FileInput from '@/components/FileInput';

interface Props {
  version: string;
  flavor: string;
  close: () => void;
}

const InstallEngine = ({ version, flavor, close }: Props) => {
  const settingsPath = useAppSelector(
    (state) => state.settings.engineDefaultInstallPath
  );
  const [dotnet, setDotnet] = useState<boolean>(false);
  const [installPath, setInstallPath] = useState(
    pathJoin(settingsPath, `${version}-${flavor}`)
  );
  const install = useCallback(() => {
    invoke('download_start', { version, flavor, dotnet, path: installPath });
    close();
  }, [version, flavor, dotnet, installPath]);

  return (
    <>
      <Stack mb="md" gap="xs">
        <Text size="sm">{t('Modals.EngineInstallType')}</Text>
        <SegmentedControl
          w="100%"
          data={[
            { label: t('Versions.BuildStandard'), value: 'standard' },
            { label: t('Versions.BuildDotnet'), value: 'dotnet' },
          ]}
          value={dotnet ? 'dotnet' : 'standard'}
          onChange={(value) => setDotnet(value === 'dotnet')}
        />
        {/*
        <Text size="xs" c="dimmied">
          The standard version is lighter while the .NET/C# one will allow you
          to create, edit and run projects for that build target. It also
          requires having the .NET SDK installed on your system.
        </Text>
        */}
      </Stack>
      <Stack mb="md" gap="xs">
        <Text size="sm">{t('Modals.EngineInstallFolder')}</Text>
        <FileInput
          isDirectory
          hasTooltip
          value={installPath}
          onChange={setInstallPath}
        />
      </Stack>
      <Text>{t('Modals.EngineInstallDescription')}</Text>
      <Group mt="md" justify="flex-end">
        <Button variant="outline" color="gray" onClick={close}>
          {t('Modals.ButtonCancel')}
        </Button>
        <Button color="green" onClick={install}>
          {t('Modals.ButtonInstall')}
        </Button>
      </Group>
    </>
  );
};

export default InstallEngine;
