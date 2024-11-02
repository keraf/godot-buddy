import { useCallback } from 'react';
import { t } from 'i18next';
import { convertFileSrc, invoke } from '@tauri-apps/api/core';
import {
  Avatar,
  Badge,
  Button,
  Group,
  Menu,
  Paper,
  rem,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {
  IconAsset,
  IconBrandCSharp,
  IconDotsVertical,
  IconFolder,
  IconPencil,
  IconPlayerPlay,
  IconStarFilled,
  IconTrash,
} from '@tabler/icons-react';

import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { showModal } from '@/slices/modalSlice';
import { getEngineInfo } from '@/slices/versionSlice';
import type { Project } from '@/tauri';
import classes from './styles.module.css';

interface Props {
  project: Project;
}

const ProjectCard = ({ project }: Props) => {
  const dispatch = useAppDispatch();
  const doubleClickAction = useAppSelector(
    (state) => state.settings.projectDoubleClickAction
  );
  const engine = useAppSelector(getEngineInfo(project.engineUse));

  const handleClick = useCallback(({ detail }: { detail: number }) => {
    // Double click event
    if (detail === 2) {
      const cmd =
        doubleClickAction === 'run' ? 'projects_run' : 'projects_edit';
      invoke(cmd, { path: project.path });
    }
  }, []);

  const onEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    invoke('projects_edit', { path: project.path });
  }, []);

  const onRun = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    invoke('projects_run', { path: project.path });
  }, []);

  return (
    <Paper onClick={handleClick} shadow="xs" withBorder my="sm" p="xs">
      <div className={classes.project}>
        <Avatar src={convertFileSrc(project.icon)} size={80} radius="md" />
        <Group justify="space-between" className={classes.metadata}>
          <Stack justify="space-evenly" gap={rem(4)}>
            <Text size="lg" fw={800}>
              {project.name}
            </Text>
            <Stack gap={rem(2)} c="dimmed">
              {engine.key && (
                <Group gap="xs">
                  <IconAsset size={rem(18)} stroke={1.5} />
                  <Text size="sm">
                    Godot v{engine.name} ({engine.flavor})
                  </Text>
                </Group>
              )}
              <Group gap="xs">
                <IconFolder size={rem(18)} stroke={1.5} />
                <Text size="sm">{project.path}</Text>
              </Group>
            </Stack>
          </Stack>
          <Stack align="flex-end">
            <Group>
              <Button
                size="xs"
                variant="outline"
                leftSection={<IconPencil size={rem(18)} stroke={1.5} />}
                onClick={onEdit}
              >
                {t('Projects.EditButton')}
              </Button>
              <Button
                size="xs"
                variant="outline"
                leftSection={<IconPlayerPlay size={rem(18)} stroke={1.5} />}
                onClick={onRun}
              >
                {t('Projects.RunButton')}
              </Button>
            </Group>
            <Group>
              <Badge color="cyan">{project.engineVersion}</Badge>
              {project.dotnet && (
                <Badge color="green">
                  <IconBrandCSharp
                    style={{ width: rem(14), height: rem(14) }}
                  />
                </Badge>
              )}
              {project.favorite && (
                <Badge color="yellow">
                  <IconStarFilled style={{ width: rem(14), height: rem(14) }} />
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
              {/*
              <Menu.Item
                leftSection={
                  <IconSettings style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Open
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconSettings style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Open with version...
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconSettings style={{ width: rem(14), height: rem(14) }} />
                }
              >
                {project.favorite ? 'Unfavorte' : 'Favorite'}
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconSettings style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Create shortcut
              </Menu.Item>
              */}
              <Menu.Item
                leftSection={
                  <IconTrash style={{ width: rem(14), height: rem(14) }} />
                }
                onClick={() =>
                  dispatch(
                    showModal({
                      name: 'project-remove',
                      params: {
                        info: {
                          name: project.name,
                          path: project.path,
                          version: project.engineVersion,
                          dotnet: project.dotnet,
                          icon: project.icon,
                        },
                      },
                    })
                  )
                }
              >
                {t('Projects.MenuRemove')}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </UnstyledButton>
      </div>
    </Paper>
  );
};

export default ProjectCard;
