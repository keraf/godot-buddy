/**
 * Indicates an icon or progress depending on if a version has
 * been installed or is being downloaded.
 */

import { useCallback } from 'react';
import { t } from 'i18next';
import { ActionIcon, Loader, rem, RingProgress, Tooltip } from '@mantine/core';
import {
  IconCloudCheck,
  IconCloudDownload,
  IconCloudX,
} from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { getDownloadStatus } from '@/slices/downloadSlice';
import { showModal } from '@/slices/modalSlice';
import { convertBytesTo, getIdealSuffixForSize } from '@/utils/file';

interface Props {
  version: string;
  flavor: string;
  tag: string;
  isInstalled: boolean;
}

const EngineStatus = ({ version, flavor, tag, isInstalled }: Props) => {
  const dispatch = useAppDispatch();
  const download = useAppSelector(getDownloadStatus(tag));
  const iconStyle = { width: rem(18), height: rem(18) };

  const startDownload = useCallback(() => {
    dispatch(
      showModal({
        name: 'engine-install',
        params: {
          version,
          flavor,
        },
      })
    );
  }, [version, flavor, tag]);

  if (isInstalled) {
    return (
      <Tooltip label={t('Versions.Downloaded')}>
        <IconCloudCheck color="var(--mantine-color-green-filled)" />
      </Tooltip>
    );
  }

  if (!download) {
    return (
      <Tooltip label={t('Versions.NotDownloaded', { version, flavor })}>
        <ActionIcon variant="transparent" color="gray" onClick={startDownload}>
          <IconCloudDownload style={iconStyle} />
        </ActionIcon>
      </Tooltip>
    );
  }

  if (download.status === 'progress') {
    const downloaded = download.downloaded ?? 0;
    const total = download.totalSize;
    const progress = (100 * downloaded) / total;
    const suffix = getIdealSuffixForSize(total);

    return (
      <Tooltip
        label={t('Versions.DownloadProgress', {
          downloaded: convertBytesTo(downloaded, suffix),
          total: convertBytesTo(total, suffix),
          suffix,
        })}
      >
        <RingProgress
          size={30}
          thickness={5}
          sections={[{ color: 'blue', value: progress }]}
        />
      </Tooltip>
    );
  }

  if (download.status === 'installing') {
    return (
      <Tooltip label={t('Versions.Installing')}>
        <Loader size={30} />
      </Tooltip>
    );
  }

  // Remaining status is either failed or unknown
  return (
    <Tooltip label={t('Versions.DownloadFailed')}>
      <IconCloudX />
    </Tooltip>
  );
};

export default EngineStatus;
