import z from 'zod';

export const zDatetime = z.preprocess(
  (val) => (val instanceof Date ? val.toISOString() : val),
  z.iso.datetime(),
);
