import * as dayjs from 'dayjs';

export function isExpired(record: { createdAt: Date }) {
  return dayjs(record.createdAt).isBefore(dayjs().subtract(24, 'hours'));
}