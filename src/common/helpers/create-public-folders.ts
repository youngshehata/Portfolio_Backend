import * as fs from 'fs';
import * as path from 'path';

export function createPublicFolders() {
  const rootPath = process.cwd();
  const publicPath = path.join(rootPath, 'public');

  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }

  const subFolders = ['personal', 'projects', 'skills', 'contacts'];

  subFolders.forEach((folder) => {
    const folderPath = path.join(publicPath, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  });
}
