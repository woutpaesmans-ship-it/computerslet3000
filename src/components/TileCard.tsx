import { useState } from 'react';
import { Tile } from '@/types/tile';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2, MessageSquare } from 'lucide-react';

interface TileCardProps {
  tile: Tile;
  onEdit: (tile: Tile) => void;
  onDelete: (id: string) => void;
}

export const TileCard = ({ tile, onEdit, onDelete }: TileCardProps) => {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tile.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const copyTileContent = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // Create HTML content with proper formatting
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            a { color: #0066cc; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          ${tile.content}
        </body>
        </html>
      `;
      
      // Create plain text fallback
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = tile.content;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      
      // Write both formats to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([htmlContent], { type: 'text/html' }),
          'text/plain': new Blob([plainText], { type: 'text/plain' })
        })
      ]);
      
      toast({
        title: "✓ Tekst gekopieerd",
        description: "HTML en platte tekst zijn naar het klembord gekopieerd",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback to basic text copy if rich copy fails
      const tempInput = document.createElement('textarea');
      tempInput.value = tile.content.replace(/<br\s*[\/]?>/gi, '\n').replace(/<[^>]+>/g, '');
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      
      toast({
        title: "✓ Tekst gekopieerd",
        description: "Platte tekst is naar het klembord gekopieerd",
      });
    }
  };

  const copySmsVersion = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // Convert HTML to plain text with proper line breaks
      const tempDiv = document.createElement('div');
      // First replace <br> tags with newlines before converting to text
      const htmlWithLineBreaks = tile.content.replace(/<br\s*\/?>/gi, '\n');
      tempDiv.innerHTML = htmlWithLineBreaks;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      
      let smsText = plainText;
      let wasModified = false;
      
      // Track original for comparison
      const originalText = smsText;
      
      // Replace typographic quotes and ligatures
      smsText = smsText
        .replace(/[""„]/g, '"')
        .replace(/['']/g, "'")
        .replace(/[—–]/g, '-')
        .replace(/\u00A0/g, ' ') // Non-breaking space
        .replace(/\t/g, ' ') // Replace tabs with spaces
        .replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII characters
      
      // Clean up multiple spaces but preserve line breaks
      smsText = smsText.replace(/[ \t]+/g, ' ').replace(/\n+/g, '\n').trim();
      
      // Check if text was modified
      if (smsText !== originalText) {
        wasModified = true;
      }
      
      // Limit to 1530 characters
      if (smsText.length > 1530) {
        smsText = smsText.substring(0, 1530);
        wasModified = true;
      }
      
      // Copy to clipboard
      await navigator.clipboard.writeText(smsText);
      
      // Show appropriate toast
      if (wasModified) {
        toast({
          title: "⚠️ Let op: de tekst werd aangepast",
          description: `SMS-veilige versie gekopieerd (${smsText.length}/1530 tekens)`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "✓ De tegel is gekopieerd",
          description: `SMS-veilige versie gekopieerd (${smsText.length}/1530 tekens)`,
        });
      }
    } catch (err) {
      console.error('Failed to copy SMS version:', err);
      toast({
        title: "Kopiëren mislukt",
        description: "Kon SMS-versie niet naar klembord kopiëren",
        variant: "destructive"
      });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Weet je zeker dat je deze tegel wilt verwijderen?")) {
      onDelete(tile.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(tile);
  };

  return (
    <Card
      ref={setNodeRef}
      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] relative group border-l-4`}
      style={{
        ...style,
        borderLeftColor: `hsl(var(--tile-${tile.color}))`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={copyTileContent}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm text-card-foreground">{tile.title}</h3>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={copySmsVersion}
              title="SMS-veilige versie kopiëren"
            >
              <MessageSquare className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleEdit}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <div
              className="cursor-grab active:cursor-grabbing p-1"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div 
          className="text-xs text-muted-foreground line-clamp-3"
          dangerouslySetInnerHTML={{ __html: tile.content }}
        />
      </CardContent>
    </Card>
  );
};