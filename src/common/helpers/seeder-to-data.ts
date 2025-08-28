import * as path from 'path';
import { readFile } from 'fs/promises';
export const seederToData = async <T = any>(
  nameOnSeedFolder: string,
): Promise<T[]> => {
  // Build path to seeder.json
  const filePath = path.join(
    process.cwd(),
    'seed',
    `${nameOnSeedFolder}`,
    `seeder.json`,
  );

  // Read file content
  const fileContent = await readFile(filePath, 'utf-8');

  // Parse JSON
  const { data } = JSON.parse(fileContent) as { data: T[] };

  return data;
};
