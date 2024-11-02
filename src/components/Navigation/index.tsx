import { useCallback } from 'react';
import { t } from 'i18next';
import {
  Center,
  Tooltip,
  UnstyledButton,
  Stack,
  Image,
  rem,
} from '@mantine/core';
import {
  IconHome2,
  IconSettings,
  IconDeviceGamepad2,
  IconNews,
  IconVersions,
} from '@tabler/icons-react';

import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { currentPage, navigate, Route } from '@/slices/routerSlice';
import logo from '@/assets/logo.png';
import classes from './styles.module.css';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  to: Route;
}

function NavbarLink({ icon: Icon, label, to }: NavbarLinkProps) {
  const page = useAppSelector(currentPage);
  const dispatch = useAppDispatch();

  const setRoute = useCallback(() => {
    dispatch(navigate(to));
  }, [dispatch, to]);

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={setRoute}
        className={classes.link}
        data-active={page === to.page || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const Navigation = () => (
  <nav className={classes.navbar}>
    <Center>
      <Image src={logo} />
    </Center>

    <div className={classes.navbarMain}>
      <Stack justify="center" gap={0}>
        <NavbarLink
          icon={IconDeviceGamepad2}
          label={t('Menu.Projects')}
          to={{ page: 'projects' }}
        />
        <NavbarLink
          icon={IconVersions}
          label={t('Menu.Versions')}
          to={{ page: 'versions', params: { tab: 'installed' } }}
        />
        <NavbarLink
          icon={IconNews}
          label={t('Menu.News')}
          to={{ page: 'news' }}
        />
        {/*
        <NavbarLink
          icon={IconDownload}
          label={t('Menu.Downloads')}
          to={{ page: 'downloads' }}
        />
        */}
      </Stack>
    </div>

    <Stack justify="center" gap={0}>
      <NavbarLink
        icon={IconSettings}
        label={t('Menu.Settings')}
        to={{ page: 'settings' }}
      />
    </Stack>
  </nav>
);

export default Navigation;
