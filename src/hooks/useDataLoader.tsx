import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';

function useDataLoader<T>(command: string, defaultValue: T) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(defaultValue);

  useEffect(() => {
    setIsLoading(true);

    invoke<T>(command).then((resp) => {
      setIsLoading(false);
      setData(resp);
    });
  }, []);

  return { isLoading, data, setData };
}

export default useDataLoader;
