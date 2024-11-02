import {
  Avatar,
  Badge,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import type { ProjectInfo } from '@/tauri';
import { IconFolder } from '@tabler/icons-react';
import { convertFileSrc, invoke } from '@tauri-apps/api/core';
import { useCallback } from 'react';
import { useAppDispatch } from '@/hooks/useRedux';
import { removeProject } from '@/slices/projectSlice';
import { t } from 'i18next';

interface Props {
  info: ProjectInfo;
  close: () => void;
}

const RemoveProject = ({ info, close }: Props) => {
  const dispatch = useAppDispatch();
  // const versions = useAppSelector((state) => state.versions);

  const remove = useCallback(async () => {
    await invoke('projects_remove', {
      path: info.path,
      delete: false,
    });

    dispatch(removeProject(info.path));
    close();
  }, [info.path]);

  // TODO: Translate text
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
        label="Project path"
        leftSection={<IconFolder style={{ width: '70%', height: '70%' }} />}
      />
      {/* TODO: Delete from disk checkbox
      <Switch></Switch>
      */}
      <Group mt="md" justify="flex-end">
        <Button variant="outline" color="gray" onClick={close}>
          {t('Modals.ButtonCancel')}
        </Button>
        <Button color="red" onClick={remove}>
          {t('Modals.ButtonRemove')}
        </Button>
      </Group>
    </>
  );
};

export default RemoveProject;
