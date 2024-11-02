import { useEffect, useState } from 'react';
import { convertFileSrc, invoke } from '@tauri-apps/api/core';
import { appDataDir, join } from '@tauri-apps/api/path';
import { Image } from '@mantine/core';

interface Props {
  src: string;
}

const NewsImage = ({ src }: Props) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    const getImageUrl = async () => {
      const imageName = await invoke<string>('news_get_image', { url: src });
      const appDataDirPath = await appDataDir();
      const filePath = await join(appDataDirPath, `image-cache/${imageName}`);
      console.log(filePath);
      const assetUrl = convertFileSrc(filePath);
      setImage(assetUrl);
    };

    getImageUrl();
  }, []);

  return <Image src={image} height={180} />;
};

export default NewsImage;
