import { useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { t } from 'i18next';
import {
  Paper,
  Text,
  Group,
  Stack,
  rem,
  Badge,
  UnstyledButton,
  Menu,
} from '@mantine/core';
import {
  IconFolder,
  IconBrandCSharp,
  IconDotsVertical,
  IconTrash,
  IconClock2,
} from '@tabler/icons-react';
import { useAppDispatch } from '@/hooks/useRedux';
import { removeInstalledVersion } from '@/slices/versionSlice';
import type { Engine } from '@/tauri';
import classes from './styles.module.css';

interface Props {
  engine: Engine;
}

const Engine = ({ engine }: Props) => {
  const dispatch = useAppDispatch();

  const handleClick = useCallback(({ detail }: { detail: number }) => {
    // Double click event
    if (detail === 2) {
      // TODO
    }
  }, []);

  return (
    <Paper onClick={handleClick} shadow="xs" withBorder my="sm" p="xs">
      <div className={classes.engine}>
        <Group justify="space-between" className={classes.metadata}>
          <Stack justify="space-evenly" gap={rem(4)}>
            <Text size="lg" fw={800}>
              Godot v{engine.version} ({engine.flavor})
            </Text>
            <Stack gap={rem(2)} c="dimmed">
              <Group gap="xs">
                <IconClock2 size={rem(18)} stroke={1.5} />
                <Text size="sm">{engine.lastUsed}</Text>
              </Group>
              <Group gap="xs">
                <IconFolder size={rem(18)} stroke={1.5} />
                <Text size="sm">{engine.path}</Text>
              </Group>
            </Stack>
          </Stack>
          <Stack align="flex-end">
            <Group>
              {engine.dotnet && (
                <Badge color="green">
                  <IconBrandCSharp
                    style={{ width: rem(14), height: rem(14) }}
                  />
                </Badge>
              )}
            </Group>
          </Stack>
        </Group>
        <UnstyledButton>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <IconDotsVertical />
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <IconTrash style={{ width: rem(14), height: rem(14) }} />
                }
                onClick={() => {
                  // TODO: Confirmation dialog
                  invoke('versions_remove_engine', { key: engine.key });
                  dispatch(removeInstalledVersion(engine.key));
                }}
              >
                {t('Versions.MenuEngineUninstall')}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </UnstyledButton>
      </div>
    </Paper>
  );
};

export default Engine;
