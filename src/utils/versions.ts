import { t } from 'i18next';

export const getFlavorCategory = (flavor: string) => {
  if (flavor.startsWith('rc')) {
    return 'rc';
  }

  if (flavor.startsWith('beta')) {
    return 'beta';
  }

  if (flavor.startsWith('alpha')) {
    return 'alpha';
  }

  if (flavor.startsWith('dev')) {
    return 'dev';
  }

  return flavor;
};

export const getBadgeColor = (category: string) => {
  switch (category) {
    case 'stable':
      return 'green';
    case 'rc':
      return 'lime';
    case 'beta':
      return 'yellow';
    case 'alpha':
      return 'orange';
    case 'dev':
      return 'red';
    default:
      return 'blue';
  }
};

export const getTooltipLabel = (category: string) => {
  switch (category) {
    case 'stable':
      return t('Versions.LabelStable');
    case 'rc':
      return t('Versions.LabelRc');
    case 'beta':
      return t('Versions.LabelBeta');
    case 'alpha':
      return t('Versions.LabelAlpha');
    case 'dev':
      return t('Versions.LabelDev');
    default:
      return undefined;
  }
};
