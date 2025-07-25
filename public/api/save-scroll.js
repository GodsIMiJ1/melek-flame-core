// 🔥 SIMPLE SCROLL SAVER - Direct to public/scrolls folder
// This is a client-side approach since we're using Vite

export default function handler(req, res) {
  // This won't work in Vite - we need a different approach
  res.status(501).json({ error: 'Use client-side file saving' });
}
