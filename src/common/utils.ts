export const converterConfig = (value, type) => {
  if (type === Boolean) {
    if (typeof value === 'string') {
      return value === 'true';
    } else if (typeof value === 'number') {
      return value === 1;
    }
    return value;
  }
  return true;
};
