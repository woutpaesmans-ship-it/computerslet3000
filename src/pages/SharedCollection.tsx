import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SharedTile {
  title: string;
  content: string;
  color: string;
}

interface SharedCollectionData {
  id: string;
  name: string;
  tiles_data: SharedTile[];
  created_at: string;
}

const getTileColorClass = (color: string) => {
  const colorMap = {
    red: 'bg-red-100 hover:bg-red-200 border-red-300',
    blue: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
    green: 'bg-green-100 hover:bg-green-200 border-green-300',
    yellow: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300',
    purple: 'bg-purple-100 hover:bg-purple-200 border-purple-300',
    gray: 'bg-gray-100 hover:bg-gray-200 border-gray-300',
  };
  return colorMap[color as keyof typeof colorMap] || colorMap.blue;
};

export const SharedCollection = () => {
  const { token } = useParams<{ token: string }>();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copiedTiles, setCopiedTiles] = useState<Set<number>>(new Set());

  const { data: collection, isLoading, error } = useQuery({
    queryKey: ['shared-collection', token],
    queryFn: async () => {
      if (!token) throw new Error('No token provided');

      const { data, error } = await supabase
        .rpc('get_shared_collection_by_token', { p_share_token: token });

      if (error) throw error;
      const row = (data && Array.isArray(data) ? data[0] : null) as {
        id: string; name: string; tiles_data: any; created_at: string;
      } | null;
      if (!row) throw new Error('Not found');
      return {
        ...row,
        tiles_data: row.tiles_data as unknown as SharedTile[]
      } as SharedCollectionData;
    },
    enabled: !!token,
    retry: false,
  });

  const copyTileContent = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedTiles(prev => new Set([...prev, index]));
      setTimeout(() => {
        setCopiedTiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }, 2000);
      toast({
        title: t('tile.copied'),
        description: t('tile.copiedDesc'),
      });
    } catch (err) {
      toast({
        title: t('tile.copyError'),
        description: t('tile.copyErrorDesc'),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('share.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">{t('share.notFound')}</h1>
          <p className="text-muted-foreground">{t('share.notFoundDesc')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <h1 className="text-xl font-bold text-primary">{collection.name}</h1>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="mb-6">
          <p className="text-muted-foreground">
            {t('share.collectionDesc')} • {new Date(collection.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {collection.tiles_data.map((tile, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all duration-200 ${getTileColorClass(tile.color)}`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-800">
                  {tile.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">
                  {tile.content}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyTileContent(tile.content, index)}
                  className="w-full"
                >
                  {copiedTiles.has(index) ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {t('tile.copied')}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      {t('tile.copy')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {collection.tiles_data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('share.noTiles')}</p>
          </div>
        )}
      </div>
    </div>
  );
};