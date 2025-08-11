import { useState, useEffect, useRef } from 'react';
import { Tile, TILE_COLORS } from '@/types/tile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TileFormProps {
  tile?: Tile | null;
  onSubmit: (data: { title: string; content: string; color: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const TileForm = ({ tile, onSubmit, onCancel, loading }: TileFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState<string>('blue');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tile) {
      setTitle(tile.title);
      setContent(tile.content);
      setColor(tile.color);
      if (contentRef.current) {
        contentRef.current.innerHTML = tile.content;
      }
    } else {
      setTitle('');
      setContent('');
      setColor('blue');
      if (contentRef.current) {
        contentRef.current.innerHTML = '';
      }
    }
  }, [tile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentContent = contentRef.current?.innerHTML || '';
    
    if (!title.trim() || !currentContent.trim()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      content: currentContent,
      color,
    });
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-lg">
          {tile ? '✏️ Tegel bewerken' : '➕ Nieuwe tegel toevoegen'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Onderwerp:</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Kleur:</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TILE_COLORS.map((colorOption) => (
                  <SelectItem key={colorOption} value={colorOption}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: `hsl(var(--tile-${colorOption}))` }}
                      />
                      <span className="capitalize">{colorOption}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Tekst:</Label>
            <div
              ref={contentRef}
              contentEditable
              className="border border-input rounded-md p-3 min-h-[120px] bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              onInput={handleContentChange}
              style={{ overflow: 'auto' }}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              💾 {loading ? 'Bezig...' : 'Bewaar'}
            </Button>
            {tile && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuleren
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};