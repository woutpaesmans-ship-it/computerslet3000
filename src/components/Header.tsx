import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { LogOut, Upload, Download, Heart, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tile } from '@/types/tile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  tiles: Tile[];
  onImport: (tiles: any[]) => void;
}

export const Header = ({ tiles, onImport }: HeaderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: t('logout.error'),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t('logout.success'),
        description: t('logout.successDesc'),
      });
    }
  };

  const exportTiles = () => {
    const exportData = tiles.map(tile => ({
      title: tile.title,
      content: tile.content,
      color: tile.color,
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
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
      description: t('export.successDesc'),
    });
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
          throw new Error("Ongeldig bestandsformaat");
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
    
    // Reset the input value so the same file can be imported again
    event.target.value = '';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">{t('header.title')}</h1>
          {user && (
            <p className="text-xs text-muted-foreground">{user.email}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/donatie')}
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4 text-red-500" />
            <span className="hidden sm:inline">{t('header.support')}</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportTiles}
            className="hidden sm:flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {t('header.export')}
          </Button>
          
          <div className="hidden sm:block">
            <input
              accept=".json"
              id="import-file"
              type="file"
              className="hidden"
              onChange={importTiles}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('import-file')?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {t('header.import')}
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Languages className="h-4 w-4" />
                <span className="hidden sm:inline">{t('header.language')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('nl')}>
                {t('language.nl')} {language === 'nl' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                {t('language.en')} {language === 'en' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('fr')}>
                {t('language.fr')} {language === 'fr' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('es')}>
                {t('language.es')} {language === 'es' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('it')}>
                {t('language.it')} {language === 'it' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('de')}>
                {t('language.de')} {language === 'de' && '✓'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t('header.logout')}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};