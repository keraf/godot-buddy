import { useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { t } from 'i18next';
import { Button, Center, rem, Stack, Text } from '@mantine/core';
import { IconFolders, IconRobotFace } from '@tabler/icons-react';

import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { showModal } from '@/slices/modalSlice';
import Content from '@/components/Content';
import Header from '@/components/Header';
import ProjectCard from '@/components/ProjectCard';
import type { ProjectInfo } from '@/tauri';

const Projects = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects);

  const addProject = useCallback(async () => {
    const projectPath = await open({
      directory: false,
      multiple: false,
      filters: [
        {
          name: t('Projects.FileDialogFilter'),
          extensions: ['godot'],
        },
      ],
    });

    if (!projectPath) {
      return;
    }

    const projectInfo = await invoke<ProjectInfo>('projects_get_info', {
      path: projectPath,
    });

    dispatch(
      showModal({
        name: 'project-add',
        params: {
          info: projectInfo,
        },
      })
    );
  }, [dispatch]);

  /*
  const newProject = useCallback(() => {
    dispatch(
      showModal({
        name: 'project-new',
      })
    );
  }, [dispatch]);
  */

  // TODO: Custom sort filter

  return (
    <>
      <Header title="Projects">
        <Button
          onClick={addProject}
          leftSection={<IconFolders size={rem(18)} stroke={1.5} />}
          size="xs"
        >
          {t('Projects.ImportButton')}
        </Button>
        {/* TODO
        <Button
          onClick={newProject}
          leftSection={<IconPlus size={rem(18)} stroke={1.5} />}
          size="xs"
        >
          {t('Projects.CreateButton')}
        </Button>
        */}
      </Header>
      <Content>
        {projects.length === 0 ? (
          <Stack>
            <Center>
              <Text size="xl">{t('Projects.NoProjects')}</Text>
            </Center>
            <Center>
              <Text w={600}>{t('Projects.NoProjectsDesc')}</Text>
            </Center>
            <Center>
              {/* TODO
              <Button
                leftSection={<IconRobotFace />}
                w={200}
                onClick={newProject}
              >
                {t('Projects.NoProjectsNew')}
              </Button>
              */}
              <Button
                leftSection={<IconRobotFace />}
                w={200}
                onClick={addProject}
              >
                {t('Projects.NoProjectsAdd')}
              </Button>
            </Center>
          </Stack>
        ) : (
          <>
            {/* Favorites */}
            {projects
              .filter((p) => p.favorite)
              .sort((a, b) => b.lastOpened - a.lastOpened)
              .map((project) => (
                <ProjectCard key={project.path} project={project} />
              ))}
            {/* Non Favorites */}
            {projects
              .filter((p) => !p.favorite)
              .sort((a, b) => b.lastOpened - a.lastOpened)
              .map((project) => (
                <ProjectCard key={project.path} project={project} />
              ))}
            {console.log(projects)}
          </>
        )}
      </Content>
    </>
  );
};

export default Projects;
