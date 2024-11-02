import React from 'react';
import { Text, Group, Stack } from '@mantine/core';

export interface SettingsInputProps {
  label: string;
  description?: string;
}

interface Props extends SettingsInputProps {
  children: React.ReactElement;
}

const SettingsInput = ({ label, description, children }: Props) => {
  return (
    <Group justify="space-between" my="md">
      <Stack gap={0}>
        <Text fw={500} mb={0}>
          {label}
        </Text>
        {description && (
          <Text fz="sm" c="dimmed">
            {description}
          </Text>
        )}
      </Stack>
      {children}
    </Group>
  );
};

export default SettingsInput;
