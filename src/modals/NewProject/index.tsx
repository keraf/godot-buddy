import { useAppSelector } from '@/hooks/useRedux';
import {
  TextInput,
  Group,
  Button,
  Select,
  SegmentedControl,
  Text,
} from '@mantine/core';
import { IconFolder } from '@tabler/icons-react';
import { t } from 'i18next';
import { useCallback, useMemo, useState } from 'react';

interface Props {
  close: () => void;
}

const NewProject = ({ close }: Props) => {
  const { installed, available } = useAppSelector((state) => state.versions);

  const create = useCallback(() => {
    close();
  }, [close]);

  const [version, setVersion] = useState<string | null>();
  const [engineType, setEngineType] = useState<'standard' | 'dotnet'>(
    'standard'
  );

  const engines = useMemo(() => {
    return {
      installed: installed.filter(
        (v) => v.dotnet === (engineType === 'dotnet')
      ),
      available: available.filter(
        (v) =>
          installed.findIndex(
            (i) => i.version === v.name && i.flavor === v.flavor
          ) > -1
      ),
    };
  }, [engineType, installed, available]);

  // TODO: Preselect latest stable version installed or available if none installed
  const isEngineInstalled = false;

  return (
    <>
      <TextInput label={t('Modals.ProjectName')} />
      <TextInput
        readOnly
        label={t('Modals.ProjectPath')}
        leftSection={<IconFolder style={{ width: '70%', height: '70%' }} />}
      />
      <Group grow align="flex-end">
        <Select
          label={t('Modals.ProjectEngineSelect')}
          data={[
            {
              group: t('Versions.Installed'),
              items: engines.installed.map((e) => ({
                label: `${e.version} (${e.flavor})`,
                value: `${e.version}-${e.flavor}`,
              })),
            },
            {
              group: t('Versions.Available'),
              items: engines.available.map((e) => ({
                label: `${e.name} (${e.flavor})`,
                value: `${e.name}-${e.flavor}`,
              })),
            },
          ]}
          value={version}
          onChange={setVersion}
        />
        <SegmentedControl
          data={[
            { label: t('Versions.BuildStandard'), value: 'standard' },
            { label: t('Versions.BuildDotnet'), value: 'dotnet' },
          ]}
          value={engineType}
          onChange={(value) => setEngineType(value as 'standard' | 'dotnet')}
        />
      </Group>
      {!isEngineInstalled && (
        <Text>
          The selected engine version is not installed on your system yet. It
          will be automatically installed.
        </Text>
      )}
      <Group mt="md" justify="flex-end">
        <Button variant="outline" color="gray" onClick={close}>
          {t('Modals.ButtonCreate')}
        </Button>
        <Button color="green" onClick={create}>
          {t('Modals.ButtonCreate')}
        </Button>
      </Group>
    </>
  );
};

export default NewProject;
