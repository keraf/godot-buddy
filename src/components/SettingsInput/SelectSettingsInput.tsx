import { NativeSelect } from '@mantine/core';

import SettingsInput, { SettingsInputProps } from '.';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setSetting } from '@/slices/settingSlice';

interface Props extends SettingsInputProps {
  name: string;
  save?: boolean;
  data: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
}

const SelectSettingsInput = ({
  name,
  label,
  description,
  save = true,
  value,
  onChange,
  data,
}: Props) => {
  const dispatch = useAppDispatch();
  const val = value ?? useAppSelector((state) => state.settings[name]);

  return (
    <SettingsInput label={label} description={description}>
      <NativeSelect
        size="sm"
        data={data}
        value={val}
        onChange={(e) => {
          if (save) {
            dispatch(
              setSetting({
                key: name,
                value: e.target.value,
              })
            );
          }

          if (onChange) {
            onChange(e.target.value);
          }
        }}
      />
    </SettingsInput>
  );
};

export default SelectSettingsInput;
