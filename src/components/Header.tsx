import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Upload, Download, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tile } from '@/types/tile';

interface HeaderProps {
  tiles: Tile[];
  onImport: (tiles: any[]) => void;
}

export const Header = ({ tiles, onImport }: HeaderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Fout bij uitloggen",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Tot ziens!",
        description: "Je bent succesvol uitgelogd.",
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
      title: "📤 Export voltooid",
      description: "Je tegels zijn geëxporteerd naar een JSON-bestand.",
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
            title: "📥 Import voltooid",
            description: `${importedData.length} tegels geïmporteerd.`,
          });
        } else {
          throw new Error("Ongeldig bestandsformaat");
        }
      } catch (err) {
        toast({
          title: "Fout bij importeren",
          description: "Het bestand kon niet worden gelezen. Controleer het formaat.",
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
          <h1 className="text-xl font-bold text-primary">🤖 Computerslet 3000</h1>
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
            <span className="hidden sm:inline">Steun ons</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportTiles}
            className="hidden sm:flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exporteer
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
              Importeer
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Uitloggen</span>
          </Button>
        </div>
      </div>
    </header>
  );
};