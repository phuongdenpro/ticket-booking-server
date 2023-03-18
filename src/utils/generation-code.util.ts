import * as shortId from 'shortid';

export function generateOrderCode() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  shortId.characters(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@',
  );
  const id = shortId.generate().replace(/[^A-Z0-9]/g, '');
  return `${year}${month}${day}${id}`;
}
