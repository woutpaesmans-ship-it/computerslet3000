import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { LogOut, Heart, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tile } from '@/types/tile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShareDropdown } from './ShareDropdown';

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
          
          <ShareDropdown tiles={tiles} onImport={onImport} />

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
                Nederlands {language === 'nl' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                English {language === 'en' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('fr')}>
                Français {language === 'fr' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('es')}>
                Español {language === 'es' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('it')}>
                Italiano {language === 'it' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('de')}>
                Deutsch {language === 'de' && '✓'}
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