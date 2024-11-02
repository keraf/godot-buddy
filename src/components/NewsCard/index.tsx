import dayjs from 'dayjs';
import { t } from 'i18next';
import { Card, Text } from '@mantine/core';

import NewsImage from '../NewsImage';
import type { NewsItem } from '@/tauri';
import classes from './styles.module.css';

interface Props {
  item: NewsItem;
}

const NewsCard = ({ item }: Props) => {
  const linkProps = {
    href: `${item.link}?ref=godot-buddy`,
    target: '_blank',
    rel: 'noopener noreferrer',
  };

  return (
    <Card
      withBorder
      radius="md"
      className={classes.card}
      component="a"
      {...linkProps}
    >
      <Card.Section>
        <NewsImage src={item.image} />
      </Card.Section>

      {/* TODO (display badge on new news items)
      <Badge
        className={classes.rating}
        variant="gradient"
        gradient={{ from: 'yellow', to: 'red' }}
      >
        New!
      </Badge>
      */}

      {/* TODO: Format date in message, not as parameter */}
      <Text fz="sm" c="dimmed" mt="sm">
        {t('News.Author', {
          creator: item.creator,
          published: dayjs(item.pubDate).format('DD MMM YYYY'),
        })}
      </Text>

      <Text fz="lg" fw={800}>
        {item.title}
      </Text>

      <Text fz="sm" c="dimmed" lineClamp={4}>
        {item.description}
      </Text>
    </Card>
  );
};

export default NewsCard;
