import { t } from 'i18next';
import { invoke } from '@tauri-apps/api/core';
import { confirm } from '@tauri-apps/plugin-dialog';
import {
  Stack,
  Center,
  Button,
  Text,
  Table,
  Menu,
  ActionIcon,
  rem,
  Badge,
  Group,
} from '@mantine/core';
import {
  IconCloudDownload,
  IconDotsVertical,
  IconTrash,
} from '@tabler/icons-react';

import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { removeInstalledVersion } from '@/slices/versionSlice';
import { navigate } from '@/slices/routerSlice';
import { getBadgeColor, getFlavorCategory } from '@/utils/versions';
import dayjs from 'dayjs';

const Installed = () => {
  const dispatch = useAppDispatch();
  const installed = useAppSelector((state) => state.versions.installed);

  if (installed.length === 0) {
    return (
      <Stack>
        <Center>
          <Text size="xl">{t('Versions.NoInstalls')}</Text>
        </Center>
        <Center>
          <Text w={600}>{t('Versions.NoInstallsDesc')}</Text>
        </Center>
        <Center>
          <Button
            leftSection={<IconCloudDownload />}
            w={200}
            onClick={() =>
              dispatch(
                navigate({ page: 'versions', params: { tab: 'available' } })
              )
            }
          >
            {t('Versions.NoInstallsAction')}
          </Button>
        </Center>
      </Stack>
    );
  }

  return (
    <Table verticalSpacing="md" highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="30%">{t('Versions.TableVersion')}</Table.Th>
          <Table.Th w="30%">{t('Versions.TableTag')}</Table.Th>
          <Table.Th w="30%">{t('Versions.TableLastUsed')}</Table.Th>
          <Table.Th w="10%"></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {installed
          // .sort((a, b) => b.lastUsed - a.lastUsed)
          .map((engine) => (
            <Table.Tr key={engine.key}>
              <Table.Td>
                <Text>Godot v{engine.version}</Text>
              </Table.Td>
              <Table.Td>
                <Group>
                  <Badge
                    color={getBadgeColor(getFlavorCategory(engine.flavor))}
                  >
                    {engine.flavor}
                  </Badge>

                  {engine.dotnet && (
                    <Badge color="teal">{t('Versions.BuildDotnet')}</Badge>
                  )}
                </Group>
              </Table.Td>
              <Table.Td>
                <Text>{dayjs(engine.lastUsed).format('DD MMM YYYY')}</Text>
              </Table.Td>
              <Table.Td align="right">
                <Menu shadow="md" width={200} position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="transparent">
                      <IconDotsVertical />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    {/*
                  TODO:
                  - Information
                  - Open installation directory
                  - 
                  */}
                    <Menu.Item
                      leftSection={
                        <IconTrash
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      }
                      onClick={async () => {
                        const resp = await confirm(
                          t('Versions.ConfirmEngineUninstallBody', {
                            version: engine.version,
                            flavor: engine.flavor,
                          }),
                          {
                            kind: 'warning',
                            title: t('Versions.ConfirmEngineUninstallTitle', {
                              version: engine.version,
                              flavor: engine.flavor,
                            }),
                            okLabel: t('Versions.ConfirmEngineUninstallYes'),
                            cancelLabel: t('Versions.ConfirmEngineUninstallNo'),
                          }
                        );
                        if (resp) {
                          invoke('versions_remove_engine', { key: engine.key });
                          dispatch(removeInstalledVersion(engine.key));
                        }
                      }}
                    >
                      {t('Versions.MenuEngineUninstall')}
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </Table.Tr>
          ))}
      </Table.Tbody>
    </Table>
  );
};

export default Installed;
