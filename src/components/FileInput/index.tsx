import { Input, rem, Tooltip } from '@mantine/core';
import { IconFolder } from '@tabler/icons-react';
import { open } from '@tauri-apps/plugin-dialog';
import { useCallback, useState } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  isDirectory?: boolean;
  hasTooltip?: boolean;
}

const FileInput = ({
  value,
  onChange,
  isDirectory = false,
  hasTooltip = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const browse = useCallback(async () => {
    if (isOpen) return;

    setIsOpen(true);
    const result = await open({
      title: '',
      defaultPath: value,
      directory: isDirectory,
      canCreateDirectories: true,
    });
    setIsOpen(false);

    if (result) {
      onChange(result);
    }
  }, [isOpen, isDirectory, value]);

  return (
    <Tooltip label={value} disabled={!hasTooltip}>
      <Input
        styles={{
          input: {
            cursor: 'pointer',
          },
        }}
        leftSection={
          <IconFolder
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
          />
        }
        readOnly
        onClick={browse}
        size="md"
        value={value}
      />
    </Tooltip>
  );
};
export default FileInput;
