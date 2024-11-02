const sizeSuffix = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export const humanReadableSize = (size: number, decimals = 1) => {
  let i = 0;
  if (size < 1024) {
    return `${size} Bytes`;
  }

  while (size >= 1024) {
    size /= 1024;
    i++;
  }

  return `${size.toFixed(decimals)} ${sizeSuffix[i]}`;
};

export const convertBytesTo = (
  size: number,
  to: (typeof sizeSuffix)[number],
  decimals = 1
) => {
  let i = 0;
  while (i < sizeSuffix.indexOf(to)) {
    size /= 1024;
    i++;
  }

  return size.toFixed(decimals);
};

export const getIdealSuffixForSize = (size: number) => {
  let i = 0;
  if (size < 1024) {
    return 'Bytes';
  }

  while (size >= 1024) {
    size /= 1024;
    i++;
  }

  return sizeSuffix[i];
};

export const pathJoin = (...args: string[]) =>
  args
    .map((part, i) =>
      i === 0
        ? part.trim().replace(/[\/]*$/g, '')
        : part.trim().replace(/(^[\/]*|[\/]*$)/g, '')
    )
    .filter((x) => x.length)
    .join('/');
