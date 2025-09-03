import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tile } from '@/types/tile';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Check } from 'lucide-react';

interface TileSelectionDialogProps {
  tiles: Tile[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TileSelectionDialog = ({ tiles, open, onOpenChange }: TileSelectionDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [collectionName, setCollectionName] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const createShareLinkMutation = useMutation({
    mutationFn: async () => {
      if (!user || selectedTiles.length === 0) throw new Error('No tiles selected');

      const selectedTileData = tiles
        .filter(tile => selectedTiles.includes(tile.id))
        .map(tile => ({
          title: tile.title,
          content: tile.content,
          color: tile.color,
        }));

      const { data, error } = await supabase
        .from('shared_collections')
        .insert({
          user_id: user.id,
          name: collectionName || t('share.defaultName'),
          tiles_data: selectedTileData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const url = `${window.location.origin}/shared/${data.share_token}`;
      setShareUrl(url);
      toast({
        title: t('share.success'),
        description: t('share.successDesc'),
      });
    },
    onError: (error) => {
      toast({
        title: t('share.error'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSelectAll = () => {
    if (selectedTiles.length === tiles.length) {
      setSelectedTiles([]);
    } else {
      setSelectedTiles(tiles.map(tile => tile.id));
    }
  };

  const handleTileToggle = (tileId: string) => {
    setSelectedTiles(prev => 
      prev.includes(tileId) 
        ? prev.filter(id => id !== tileId)
        : [...prev, tileId]
    );
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: t('share.copied'),
        description: t('share.copiedDesc'),
      });
    } catch (err) {
      toast({
        title: t('share.copyError'),
        description: t('share.copyErrorDesc'),
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setSelectedTiles([]);
    setCollectionName('');
    setShareUrl('');
    setCopied(false);
    onOpenChange(false);
  };

  if (shareUrl) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('share.linkCreated')}</DialogTitle>
            <DialogDescription>
              {t('share.linkCreatedDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="share-url" className="sr-only">
                {t('share.shareUrl')}
              </Label>
              <Input
                id="share-url"
                defaultValue={shareUrl}
                readOnly
                className="bg-muted"
              />
            </div>
            <Button size="sm" className="px-3" onClick={copyToClipboard}>
              <span className="sr-only">{t('share.copy')}</span>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button variant="secondary" onClick={handleClose}>
              {t('share.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('share.selectTiles')}</DialogTitle>
          <DialogDescription>
            {t('share.selectTilesDesc')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="collection-name">{t('share.collectionName')}</Label>
            <Input
              id="collection-name"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder={t('share.collectionNamePlaceholder')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedTiles.length === tiles.length ? t('share.deselectAll') : t('share.selectAll')}
            </Button>
            <span className="text-sm text-muted-foreground">
              {selectedTiles.length} / {tiles.length} {t('share.selected')}
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {tiles.map((tile) => (
              <div key={tile.id} className="flex items-center space-x-2">
                <Checkbox
                  id={tile.id}
                  checked={selectedTiles.includes(tile.id)}
                  onCheckedChange={() => handleTileToggle(tile.id)}
                />
                <Label
                  htmlFor={tile.id}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {tile.title}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t('share.cancel')}
          </Button>
          <Button
            onClick={() => createShareLinkMutation.mutate()}
            disabled={selectedTiles.length === 0 || createShareLinkMutation.isPending}
          >
            {createShareLinkMutation.isPending ? t('share.creating') : t('share.createLink')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};