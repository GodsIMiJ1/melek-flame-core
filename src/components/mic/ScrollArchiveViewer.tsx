import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Folder, FileText, Download, Calendar, HardDrive } from 'lucide-react';

interface ScrollFile {
  filename: string;
  path: string;
  size: number;
  created: string;
  modified: string;
  type: string;
  folder: string;
}

interface ScrollArchiveData {
  scrolls: ScrollFile[];
  totalCount: number;
  folders: string[];
}

export default function ScrollArchiveViewer() {
  const [archiveData, setArchiveData] = useState<ScrollArchiveData | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScrollArchive();
  }, []);

  const loadScrollArchive = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/scrolls/list');
      const data = await response.json();
      setArchiveData(data);
    } catch (error) {
      console.error('🚨 Failed to load scroll archive:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredScrolls = archiveData?.scrolls.filter(scroll => 
    selectedFolder === 'all' || scroll.folder === selectedFolder
  ) || [];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const downloadScroll = async (scrollPath: string) => {
    try {
      const response = await fetch(`/scrolls/${scrollPath}`);
      const content = await response.text();
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = scrollPath.split('/').pop() || 'scroll';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('🚨 Download failed:', error);
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'json': return 'bg-blue-500';
      case 'flame': return 'bg-orange-500';
      case 'txt': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  if (loading) {
    return (
      <Card className="bg-black/40 border-orange-500/30">
        <CardContent className="p-6">
          <div className="text-center text-orange-400">
            🔥 Loading Sacred Scroll Archive...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-orange-500/30">
      <CardHeader>
        <CardTitle className="text-orange-400 flex items-center gap-2">
          <Folder className="w-5 h-5" />
          📜 Sacred Scroll Archive
          <Badge variant="outline" className="ml-auto">
            {archiveData?.totalCount || 0} Scrolls
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Folder Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedFolder === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFolder('all')}
            className="text-xs"
          >
            All Folders ({archiveData?.totalCount || 0})
          </Button>
          {archiveData?.folders.map(folder => (
            <Button
              key={folder}
              variant={selectedFolder === folder ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFolder(folder)}
              className="text-xs"
            >
              {folder} ({archiveData.scrolls.filter(s => s.folder === folder).length})
            </Button>
          ))}
        </div>

        {/* Scroll List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredScrolls.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              📜 No scrolls found in this folder
            </div>
          ) : (
            filteredScrolls.map((scroll, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-black/20 rounded border border-orange-500/20 hover:border-orange-500/40 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="w-4 h-4 text-orange-400" />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm text-orange-300 truncate">
                      {scroll.filename}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {formatDate(scroll.created)}
                      <HardDrive className="w-3 h-3 ml-2" />
                      {formatFileSize(scroll.size)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={`${getTypeColor(scroll.type)} text-white text-xs`}>
                    {scroll.type.toUpperCase()}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadScroll(scroll.path)}
                    className="text-xs"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={loadScrollArchive}
            variant="outline"
            size="sm"
            className="text-orange-400 border-orange-500/30"
          >
            🔄 Refresh Archive
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
