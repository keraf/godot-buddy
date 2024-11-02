import React from 'react';
import { Container, Group, Text } from '@mantine/core';
import classes from './styles.module.css';

interface Props {
  title: string;
  children?: React.ReactNode;
}

const Header = ({ title, children }: Props) => {
  return (
    <header className={classes.header}>
      <Container size="md">
        <div className={classes.inner}>
          <Text size="xl">{title}</Text>
          <Group gap={5} visibleFrom="sm">
            {children}
          </Group>
        </div>
      </Container>
    </header>
  );
};

export default Header;
