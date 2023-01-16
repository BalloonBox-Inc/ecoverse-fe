export const snakeToCamel = (str: string): string =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', '')
    );

export const properCase = (str: string): string => {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
};

export const urlify = (str: string): string => {
  return str.replace(/ /g, '%20');
};

export const numFormat = (num: number) => {
  return Number(num.toFixed(2)).toLocaleString('en-US');
};

export const m2ToHaFormat = (num: number) => {
  const converted = num / 10000;
  return numFormat(converted);
};

export const getBasePathName = (pathName: string) => {
  return pathName.match(/(?<=\/)\w+/g)?.[0] ?? '';
};
