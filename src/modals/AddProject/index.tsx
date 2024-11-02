import { useCallback, useState } from 'react';
import { t } from 'i18next';
import { convertFileSrc, invoke } from '@tauri-apps/api/core';
import {
  Avatar,
  Badge,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { IconFolder } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { addProject } from '@/slices/projectSlice';
import type { Project, ProjectInfo } from '@/tauri';

interface Props {
  info: ProjectInfo;
  close: () => void;
}

const AddProject = ({ info, close }: Props) => {
  const dispatch = useAppDispatch();
  const versions = useAppSelector((state) => state.versions.installed);
  const [engineRun, /* setEngineRun */ _] = useState<string | null>(
    versions[0].key ?? null
  );

  const add = useCallback(async () => {
    try {
      const project = await invoke<Project>('projects_add', {
        path: info.path,
        engineRun,
      });

      dispatch(addProject(project));
      close();
    } catch (err) {
      console.error(err);
      // TODO: Handle errors
    }
  }, [info.path, engineRun]);

  // TODO: Version selector (download if version is not installed)

  return (
    <>
      <Group mb="md">
        <Avatar src={convertFileSrc(info.icon)} size={64} radius="md" />
        <Stack justify="space-evenly">
          <Text size="xl">{info.name}</Text>
          <Group>
            <Badge color="cyan">{info.version}</Badge>
            {info.dotnet ? (
              <Badge color="teal">{t('Versions.BuildDotnet')}</Badge>
            ) : (
              <Badge color="blue">{t('Versions.BuildStandard')}</Badge>
            )}
          </Group>
        </Stack>
      </Group>
      <TextInput
        value={info.path}
        readOnly
        label={t('Modals.ProjectPath')}
        leftSection={<IconFolder style={{ width: '70%', height: '70%' }} />}
      />
      {/*
      <Select
        label={t('Modals.ProjectEngineSelect')}
        value={engineRun}
        onChange={setEngineRun}
        data={versions.map((v) => ({
          label: `Godot v${v.version} (${v.flavor}-${
            v.dotnet ? 'mono' : 'std'
          })`,
          value: v.key,
        }))}
        leftSection={<IconRobot style={{ width: '70%', height: '70%' }} />}
      />
      */}
      <Group mt="md" justify="flex-end">
        <Button variant="outline" color="gray" onClick={close}>
          {t('Modals.ButtonCancel')}
        </Button>
        <Button color="green" onClick={add}>
          {t('Modals.ButtonAdd')}
        </Button>
      </Group>
    </>
  );
};

export default AddProject;
