import { Center, Loader, SimpleGrid } from '@mantine/core';
import useDataLoader from '@/hooks/useDataLoader';
import NewsCard from '@/components/NewsCard';
import Header from '@/components/Header';
import Content from '@/components/Content';
import type { NewsItem } from '@/tauri';

const News = () => {
  const { isLoading, data: news } = useDataLoader<NewsItem[]>('news_get', []);

  return (
    <>
      <Header title="News" />
      <Content>
        {isLoading ? (
          <Center mt="xl">
            <Loader />
          </Center>
        ) : (
          <SimpleGrid cols={3}>
            {news.map((item) => (
              <NewsCard item={item} />
            ))}
          </SimpleGrid>
        )}
      </Content>
    </>
  );
};

export default News;
