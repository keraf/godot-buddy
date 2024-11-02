import { t } from 'i18next';
import { Center, rem, SegmentedControl } from '@mantine/core';

import Content from '@/components/Content';
import Header from '@/components/Header';
import Installed from './Installed';
import Available from './Available';
import { useAppDispatch } from '@/hooks/useRedux';
import { navigate } from '@/slices/routerSlice';
import { IconCloud, IconDeviceFloppy } from '@tabler/icons-react';

type Tab = 'installed' | 'available';
interface Props {
  tab: Tab;
}

const VersionManager = ({ tab }: Props) => {
  const dispatch = useAppDispatch();
  const iconStyle = { width: rem(16), height: rem(16) };

  return (
    <>
      <Header title={t('Versions.Title')}>
        <SegmentedControl
          w={rem(260)}
          data={[
            {
              label: (
                <Center style={{ gap: 10 }}>
                  <IconDeviceFloppy style={iconStyle} />
                  <span>{t('Versions.Installed')}</span>
                </Center>
              ),
              value: 'installed',
            },
            {
              label: (
                <Center style={{ gap: 10 }}>
                  <IconCloud style={iconStyle} />
                  <span>{t('Versions.Available')}</span>
                </Center>
              ),
              value: 'available',
            },
          ]}
          value={tab}
          onChange={(value) =>
            dispatch(
              navigate({
                page: 'versions',
                params: { tab: value as Tab },
              })
            )
          }
        />
      </Header>
      <Content>
        {tab === 'installed' && <Installed />}
        {tab === 'available' && <Available />}
      </Content>
    </>
  );
};

export default VersionManager;
