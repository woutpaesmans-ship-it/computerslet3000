import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dashboard } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2 } from 'lucide-react';

interface DashboardSelectorProps {
  currentDashboardId?: string;
  onDashboardChange: (dashboardId: string) => void;
}

export const DashboardSelector = ({ currentDashboardId, onDashboardChange }: DashboardSelectorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');

  // Fetch dashboards
  const { data: dashboards = [], isLoading } = useQuery({
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

  // Create dashboard mutation
  const createDashboardMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('dashboards')
        .insert({
          user_id: user.id,
          name,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dashboards', user?.id] });
      onDashboardChange(data.id);
      setShowCreateDialog(false);
      setNewDashboardName('');
      toast({
        title: t('dashboard.created'),
        description: t('dashboard.createdDesc'),
      });
    },
    onError: (error) => {
      toast({
        title: t('dashboard.createError'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete dashboard mutation
  const deleteDashboardMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('dashboards')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['tiles', user?.id] });
      toast({
        title: t('dashboard.deleted'),
        description: t('dashboard.deletedDesc'),
      });
    },
    onError: (error) => {
      toast({
        title: t('dashboard.deleteError'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateDashboard = () => {
    if (!newDashboardName.trim()) return;
    createDashboardMutation.mutate(newDashboardName.trim());
  };

  const handleDeleteDashboard = (dashboardId: string) => {
    if (dashboards.length <= 1) {
      toast({
        title: t('dashboard.cannotDelete'),
        description: t('dashboard.cannotDeleteDesc'),
        variant: "destructive",
      });
      return;
    }

    if (currentDashboardId === dashboardId) {
      const otherDashboard = dashboards.find(d => d.id !== dashboardId);
      if (otherDashboard) {
        onDashboardChange(otherDashboard.id);
      }
    }

    deleteDashboardMutation.mutate(dashboardId);
  };

  if (isLoading) {
    return <div className="w-48 h-10 bg-muted animate-pulse rounded-md" />;
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Select value={currentDashboardId} onValueChange={onDashboardChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t('dashboard.select')} />
          </SelectTrigger>
          <SelectContent>
            {dashboards.map((dashboard) => (
              <SelectItem key={dashboard.id} value={dashboard.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{dashboard.name}</span>
                  {dashboards.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-2 opacity-50 hover:opacity-100"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteDashboard(dashboard.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">{t('dashboard.new')}</span>
        </Button>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('dashboard.newTitle')}</DialogTitle>
            <DialogDescription>
              {t('dashboard.newDesc')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="dashboard-name">{t('dashboard.name')}</Label>
              <Input
                id="dashboard-name"
                value={newDashboardName}
                onChange={(e) => setNewDashboardName(e.target.value)}
                placeholder={t('dashboard.namePlaceholder')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateDashboard();
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              {t('dashboard.cancel')}
            </Button>
            <Button
              onClick={handleCreateDashboard}
              disabled={!newDashboardName.trim() || createDashboardMutation.isPending}
            >
              {createDashboardMutation.isPending ? t('dashboard.creating') : t('dashboard.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};