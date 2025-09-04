import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tile } from '@/types/tile';
import type { Dashboard } from '@/types/dashboard';
import { TileCard } from './TileCard';
import { TileForm } from './TileForm';
import { Header } from './Header';
import { DashboardSelector } from './DashboardSelector';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentDashboardId, setCurrentDashboardId] = useState<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch dashboards
  const { data: dashboards = [] } = useQuery({
    queryKey: ['dashboards', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Dashboard[];
    },
    enabled: !!user,
  });

  // Set default dashboard when dashboards are loaded
  useEffect(() => {
    if (dashboards.length > 0 && !currentDashboardId) {
      setCurrentDashboardId(dashboards[0].id);
    }
  }, [dashboards, currentDashboardId]);

  // Fetch tiles for current dashboard
  const { data: tiles = [], isLoading } = useQuery({
    queryKey: ['tiles', user?.id, currentDashboardId],
    queryFn: async () => {
      if (!user || !currentDashboardId) return [];
      
      const { data, error } = await supabase
        .from('tiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('dashboard_id', currentDashboardId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as Tile[];
    },
    enabled: !!user && !!currentDashboardId,
  });

  // Create tile mutation
  const createTileMutation = useMutation({
    mutationFn: async (tileData: { title: string; content: string; color: string }) => {
      if (!user || !currentDashboardId) throw new Error('User not authenticated or no dashboard selected');

      const maxOrderIndex = tiles.length > 0 ? Math.max(...tiles.map(t => t.order_index)) : -1;
      
      const { data, error } = await supabase
        .from('tiles')
        .insert({
          user_id: user.id,
          dashboard_id: currentDashboardId,
          title: tileData.title,
          content: tileData.content,
          color: tileData.color,
          order_index: maxOrderIndex + 1,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiles', user?.id, currentDashboardId] });
      setShowForm(false);
      toast({
        title: t('tile.created'),
        description: t('tile.created'),
      });
    },
    onError: (error) => {
      toast({
        title: "Fout bij aanmaken",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update tile mutation
  const updateTileMutation = useMutation({
    mutationFn: async ({ id, ...tileData }: { id: string; title: string; content: string; color: string }) => {
      const { data, error } = await supabase
        .from('tiles')
        .update(tileData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiles', user?.id, currentDashboardId] });
      setEditingTile(null);
      toast({
        title: "Tegel bijgewerkt",
        description: "Je wijzigingen zijn opgeslagen.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fout bij bijwerken",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete tile mutation
  const deleteTileMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiles', user?.id, currentDashboardId] });
      toast({
        title: "Tegel verwijderd",
        description: "De tegel is succesvol verwijderd.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fout bij verwijderen",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: async (orderedTiles: Tile[]) => {
      const updates = orderedTiles.map((tile, index) => ({
        id: tile.id,
        order_index: index,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('tiles')
          .update({ order_index: update.order_index })
          .eq('id', update.id);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiles', user?.id, currentDashboardId] });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tiles.findIndex((tile) => tile.id === active.id);
      const newIndex = tiles.findIndex((tile) => tile.id === over.id);

      const newTiles = arrayMove(tiles, oldIndex, newIndex);
      updateOrderMutation.mutate(newTiles);
    }
  };

  const handleSubmit = (data: { title: string; content: string; color: string }) => {
    if (editingTile) {
      updateTileMutation.mutate({ id: editingTile.id, ...data });
    } else {
      createTileMutation.mutate(data);
    }
  };

  const handleImport = async (importedTiles: any[]) => {
    if (!user || !currentDashboardId) return;

    try {
      const maxOrderIndex = tiles.length > 0 ? Math.max(...tiles.map(t => t.order_index)) : -1;
      
      const tilesToInsert = importedTiles.map((tile, index) => ({
        user_id: user.id,
        dashboard_id: currentDashboardId,
        title: tile.title || 'Untitled',
        content: tile.content || tile.text || '',
        color: tile.color || 'blue',
        order_index: maxOrderIndex + 1 + index,
      }));

      const { error } = await supabase
        .from('tiles')
        .insert(tilesToInsert);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['tiles', user?.id, currentDashboardId] });
    } catch (error) {
      toast({
        title: "Fout bij importeren",
        description: "Niet alle tegels konden worden geïmporteerd.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('dashboard.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Header tiles={tiles} onImport={handleImport} />
      
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <DashboardSelector
            currentDashboardId={currentDashboardId}
            onDashboardChange={setCurrentDashboardId}
          />
        </div>
        <div className="mb-6">
          <p className="text-muted-foreground mb-4">
            {t('dashboard.instruction')}
          </p>
          
          {!showForm && !editingTile && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              ➕ {t('dashboard.addTile')}
            </button>
          )}
          
          {(showForm || editingTile) && (
            <TileForm
              tile={editingTile}
              onSubmit={handleSubmit}
              onCancel={() => {
                setEditingTile(null);
                setShowForm(false);
              }}
              loading={createTileMutation.isPending || updateTileMutation.isPending}
            />
          )}
        </div>

        {tiles.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={tiles.map(tile => tile.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {tiles.map((tile) => (
                  <TileCard
                    key={tile.id}
                    tile={tile}
                    onEdit={setEditingTile}
                    onDelete={(id) => deleteTileMutation.mutate(id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

      </div>
    </div>
  );
}