export const toBoolean = (value) => {
  switch (typeof value) {
    case 'string':
      return ['true', '1'].includes(value.toLowerCase());

    case 'number':
      return Boolean(value);

    default:
      return Boolean(value);
  }
};
