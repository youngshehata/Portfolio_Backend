import { unlink } from 'fs/promises';

export const deleteMultipleFiles = async (files: string[]) => {
  for (const file of files) {
    await unlink(file);
  }
};
