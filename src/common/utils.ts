import { v4 } from 'uuid';

export const UUIDRandom = () => {
  return v4().toString();
};
