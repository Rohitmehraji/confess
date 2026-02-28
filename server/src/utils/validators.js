export const phoneRegex = /^\+?[1-9]\d{8,14}$/;

export const isValidPhone = (phone = '') => phoneRegex.test(String(phone).trim());

export const parseScheduledDateTime = ({ date, hour, minute, second }) => {
  const [day, month, year] = String(date || '').split('/').map(Number);
  if (!day || !month || !year) {
    throw new Error('Invalid date format. Use dd/MM/yyyy');
  }

  const parsed = new Date(year, month - 1, day, Number(hour), Number(minute), Number(second));
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid date/time values');
  }

  return parsed;
};
