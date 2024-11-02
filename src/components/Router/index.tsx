import { useAppSelector } from '@/hooks/useRedux';

import AssetManager from '@/views/AssetManager';
import Projects from '@/views/Projects';
import VersionManager from '@/views/VersionManager';
import Documentation from '@/views/Documentation';
import News from '@/views/News';
import Downloads from '@/views/Downloads';
import Settings from '@/views/Settings';

const Router = () => {
  const router = useAppSelector((state) => state.router.current);

  switch (router.page) {
    case 'projects':
      return <Projects />;
    case 'versions':
      return <VersionManager tab={router.params.tab} />;
    case 'assets':
      return <AssetManager />;
    case 'documentation':
      return <Documentation />;
    case 'news':
      return <News />;
    case 'downloads':
      return <Downloads />;
    case 'settings':
      return <Settings />;
    default:
      return <p>Not found...</p>;
  }
};

export default Router;
