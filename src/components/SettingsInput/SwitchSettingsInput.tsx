import { Switch } from '@mantine/core';

import SettingsInput, { SettingsInputProps } from '.';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setSetting } from '@/slices/settingSlice';

interface Props extends SettingsInputProps {
  name: string;
  save: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

const SwitchSettingsInput = ({
  name,
  label,
  description,
  save = true,
  value,
  onChange,
}: Props) => {
  const dispatch = useAppDispatch();
  const val =
    value ?? useAppSelector((state) => state.settings[name]) === 'true';

  return (
    <SettingsInput label={label} description={description}>
      <Switch
        size="md"
        checked={val}
        onChange={() => {
          if (save) {
            dispatch(
              setSetting({
                key: name,
                value: (!val).toString(),
              })
            );
          }

          if (onChange) {
            onChange(!val);
          }
        }}
      />
    </SettingsInput>
  );
};

export default SwitchSettingsInput;
