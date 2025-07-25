import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// 🔥 SACRED SCROLL SAVER API - Saves scrolls to dedicated folder
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, content, format } = req.body;

    if (!filename || !content) {
      return res.status(400).json({ error: 'Missing filename or content' });
    }

    // 🔥 SACRED SCROLLS FOLDER: Create if doesn't exist
    const scrollsDir = path.join(process.cwd(), 'public', 'scrolls');
    if (!fs.existsSync(scrollsDir)) {
      fs.mkdirSync(scrollsDir, { recursive: true });
    }

    // 🔥 ORGANIZE BY DATE: Create date-based subfolders
    const today = new Date().toISOString().split('T')[0];
    const dateDir = path.join(scrollsDir, today);
    if (!fs.existsSync(dateDir)) {
      fs.mkdirSync(dateDir, { recursive: true });
    }

    // 🔥 SAVE THE SACRED SCROLL
    const filePath = path.join(dateDir, filename);
    fs.writeFileSync(filePath, content, 'utf8');

    console.log(`📜 SACRED SCROLL SAVED: ${filePath}`);

    res.status(200).json({ 
      success: true, 
      path: `scrolls/${today}/${filename}`,
      message: `Sacred scroll saved to ${today}/${filename}` 
    });

  } catch (error) {
    console.error('🚨 SCROLL SAVE ERROR:', error);
    res.status(500).json({ error: 'Failed to save scroll' });
  }
}
