import { useState, useMemo } from 'react';
import { t } from 'i18next';
import {
  Group,
  Switch,
  Select,
  Table,
  Badge,
  Tooltip,
  Text,
  Menu,
  rem,
  ActionIcon,
} from '@mantine/core';
import { IconDotsVertical, IconExternalLink } from '@tabler/icons-react';

import { useAppSelector } from '@/hooks/useRedux';
import EngineStatus from '@/components/EngineStatus';
import {
  getFlavorCategory,
  getTooltipLabel,
  getBadgeColor,
} from '@/utils/versions';

const GODOT_SITE = 'https://godotengine.org';

const Available = () => {
  const [versionFilter, setVersionFilter] = useState<string | null>(null);
  const [showLatest, setShowLatest] = useState(true);
  const [showPrerelease, setShowPrerelease] = useState(false);

  const { available, installed } = useAppSelector((state) => state.versions);
  const filteredBuilds = useMemo(() => {
    let builds = [...available];

    if (!showPrerelease) {
      builds = builds.filter((v) => v.flavor === 'stable');
    }

    if (showLatest) {
      builds = builds.filter(
        (val, idx, self) => idx === self.findIndex((t) => t.group === val.group)
      );
    }

    if (versionFilter) {
      builds = builds.filter((v) => v.name.startsWith(versionFilter));
    }

    return builds;
  }, [available, showPrerelease, showLatest, versionFilter]);

  return (
    <>
      <Group justify="space-between">
        <Switch
          label={t('Versions.PrereleaseFilter')}
          checked={showPrerelease}
          onChange={(e) => setShowPrerelease(e.currentTarget.checked)}
          labelPosition="right"
        />
        <Switch
          label={t('Versions.LatestFilter')}
          checked={showLatest}
          onChange={(e) => setShowLatest(e.currentTarget.checked)}
          labelPosition="right"
        />
        <Select
          placeholder={t('Versions.VersionFilter')}
          data={[...new Set(available.map((v) => v.name))]}
          value={versionFilter}
          onChange={setVersionFilter}
          clearable
          searchable
        />
      </Group>
      <Table verticalSpacing="md" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w="10%"></Table.Th>
            <Table.Th w="20%">{t('Versions.TableVersion')}</Table.Th>
            <Table.Th w="30%">{t('Versions.TableTag')}</Table.Th>
            <Table.Th w="30%">{t('Versions.TableRelease')}</Table.Th>
            <Table.Th w="10%"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredBuilds.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={5}>{t('Versions.NoResults')}</Table.Td>
            </Table.Tr>
          ) : (
            <>
              {filteredBuilds.map((v) => {
                const category = getFlavorCategory(v.flavor);
                const isInstalled =
                  installed.findIndex(
                    (i) => i.version === v.name && i.flavor === v.flavor
                  ) !== -1;

                return (
                  <Table.Tr key={v.key}>
                    <Table.Td>
                      <EngineStatus
                        version={v.name}
                        flavor={v.flavor}
                        tag={v.key}
                        isInstalled={isInstalled}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text>{v.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Tooltip
                        multiline
                        w={220}
                        label={getTooltipLabel(category)}
                      >
                        <Badge color={getBadgeColor(category)}>
                          {v.flavor}
                        </Badge>
                      </Tooltip>
                    </Table.Td>
                    <Table.Td>
                      <Text>{v.releaseDate}</Text>
                    </Table.Td>
                    <Table.Td align="right">
                      <Menu shadow="md" width={200} position="bottom-end">
                        <Menu.Target>
                          <ActionIcon variant="transparent">
                            <IconDotsVertical />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={
                              <IconExternalLink
                                style={{ width: rem(14), height: rem(14) }}
                              />
                            }
                            component="a"
                            href={`${GODOT_SITE}${v.releaseNotes}?ref=godot-buddy`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t('Versions.MenuReleaseNotes')}
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </>
          )}
        </Table.Tbody>
      </Table>
    </>
  );
};

export default Available;
