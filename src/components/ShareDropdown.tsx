import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Share, Download, Upload, Link } from 'lucide-react';
import { Tile } from '@/types/tile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TileSelectionDialog } from './TileSelectionDialog';
import { ExportSelectionDialog } from './ExportSelectionDialog';

interface ShareDropdownProps {
  tiles: Tile[];
  dashboards: any[];
  currentDashboardId: string;
  onImport: (tiles: any[]) => void;
}

export const ShareDropdown = ({ tiles, dashboards, currentDashboardId, onImport }: ShareDropdownProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [showTileSelection, setShowTileSelection] = useState(false);
  const [showExportSelection, setShowExportSelection] = useState(false);

  const exportTiles = () => {
    setShowExportSelection(true);
  };

  const importTiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          onImport(importedData);
          toast({
            title: t('import.success'),
            description: `${importedData.length} ${t('import.successDesc')}`,
          });
        } else {
          throw new Error(t('import.error'));
        }
      } catch (err) {
        toast({
          title: t('import.error'),
          description: t('import.errorDesc'),
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    event.target.value = '';
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Share className="h-4 w-4" />
            <span className="hidden sm:inline">{t('share.button')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={exportTiles}>
            <Download className="h-4 w-4 mr-2" />
            {t('header.export')}
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => document.getElementById('import-file')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            {t('header.import')}
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setShowTileSelection(true)}>
            <Link className="h-4 w-4 mr-2" />
            {t('share.createLink')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        accept=".json"
        id="import-file"
        type="file"
        className="hidden"
        onChange={importTiles}
      />

      <TileSelectionDialog
        tiles={tiles}
        dashboards={dashboards}
        currentDashboardId={currentDashboardId}
        open={showTileSelection}
        onOpenChange={setShowTileSelection}
      />

      <ExportSelectionDialog
        tiles={tiles}
        dashboards={dashboards}
        currentDashboardId={currentDashboardId}
        open={showExportSelection}
        onOpenChange={setShowExportSelection}
      />
    </>
  );
};