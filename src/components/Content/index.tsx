import { Box, Container } from '@mantine/core';
import classes from './styles.module.css';

const Content = ({ children }: { children: React.ReactNode }) => (
  <Box className={classes.content}>
    <Container>{children}</Container>
  </Box>
);

export default Content;
