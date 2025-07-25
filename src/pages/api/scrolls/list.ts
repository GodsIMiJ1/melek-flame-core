import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// 🔥 SACRED SCROLL LISTER API - Lists all saved scrolls
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const scrollsDir = path.join(process.cwd(), 'public', 'scrolls');

    if (!fs.existsSync(scrollsDir)) {
      return res.status(200).json({ scrolls: [], totalCount: 0 });
    }

    const scrolls: any[] = [];

    // 🔥 RECURSIVE SCROLL DISCOVERY - Enhanced to handle both flat and organized structures
    function scanDirectory(dir: string, relativePath: string = '') {
      try {
        const items = fs.readdirSync(dir);

        for (const item of items) {
          // Skip README files
          if (item === 'README.md') continue;

          const fullPath = path.join(dir, item);
          const itemRelativePath = path.join(relativePath, item);

          if (fs.statSync(fullPath).isDirectory()) {
            // Recursively scan subdirectories
            scanDirectory(fullPath, itemRelativePath);
          } else if (item.endsWith('.json') || item.endsWith('.flame') || item.endsWith('.txt')) {
            const stats = fs.statSync(fullPath);

            // 🔥 ENHANCED FOLDER DETECTION: Handle both flat and organized structures
            let folderName = path.dirname(itemRelativePath) || 'root';
            if (folderName === '.' || folderName === '') {
              folderName = 'root';
            }

            scrolls.push({
              filename: item,
              path: itemRelativePath.replace(/\\/g, '/'), // Normalize path separators
              size: stats.size,
              created: stats.birthtime,
              modified: stats.mtime,
              type: path.extname(item).substring(1),
              folder: folderName
            });
          }
        }
      } catch (error) {
        console.error(`🚨 Error scanning directory ${dir}:`, error);
      }
    }

    scanDirectory(scrollsDir);

    // 🔥 SORT BY CREATION DATE (NEWEST FIRST)
    scrolls.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    res.status(200).json({
      scrolls,
      totalCount: scrolls.length,
      folders: [...new Set(scrolls.map(s => s.folder))].sort()
    });

  } catch (error) {
    console.error('🚨 SCROLL LIST ERROR:', error);
    res.status(500).json({ error: 'Failed to list scrolls' });
  }
}
