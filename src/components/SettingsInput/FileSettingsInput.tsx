import SettingsInput, { SettingsInputProps } from '.';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setSetting } from '@/slices/settingSlice';
import FileInput from '../FileInput';

interface Props extends SettingsInputProps {
  name: string;
  save?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  isDirectory?: boolean;
}

const FileSettingsInput = ({
  name,
  label,
  description,
  save = true,
  value,
  onChange,
  isDirectory = false,
}: Props) => {
  const dispatch = useAppDispatch();
  const val = value ?? useAppSelector((state) => state.settings[name]);

  return (
    <SettingsInput label={label} description={description}>
      <FileInput
        hasTooltip
        isDirectory={isDirectory}
        value={val}
        onChange={(value) => {
          if (save) {
            dispatch(
              setSetting({
                key: name,
                value,
              })
            );
          }

          if (onChange) {
            onChange(value);
          }
        }}
      />
    </SettingsInput>
  );
};

export default FileSettingsInput;
