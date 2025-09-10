import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tile } from '@/types/tile';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExportSelectionDialogProps {
  tiles: Tile[];
  dashboards: any[];
  currentDashboardId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExportSelectionDialog = ({ tiles, dashboards, currentDashboardId, open, onOpenChange }: ExportSelectionDialogProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);

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

  const handleExport = () => {
    const selectedTileData = tiles
      .filter(tile => selectedTiles.includes(tile.id))
      .map(tile => ({
        title: tile.title,
        content: tile.content,
        color: tile.color,
      }));
    
    const blob = new Blob([JSON.stringify(selectedTileData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "computerslet_3000_tegels.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: t('export.success'),
      description: `${selectedTileData.length} ${t('export.successDesc')}`,
    });

    handleClose();
  };

  const handleClose = () => {
    setSelectedTiles([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('export.selectTiles')}</DialogTitle>
          <DialogDescription>
            {t('export.selectTilesDesc')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
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
            onClick={handleExport}
            disabled={selectedTiles.length === 0}
          >
            {t('header.export')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};