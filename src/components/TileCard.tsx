import { useState } from 'react';
import { Tile } from '@/types/tile';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2 } from 'lucide-react';

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

  const sanitizeToAscii = (text: string): string => {
    return text
      // Replace smart quotes with regular quotes
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      // Replace em/en dashes with regular hyphens
      .replace(/[—–]/g, '-')
      // Replace non-breaking spaces with regular spaces
      .replace(/\u00A0/g, ' ')
      // Replace various bullet points with asterisk
      .replace(/[•·‧∙]/g, '*')
      // Remove emojis and other non-ASCII characters
      .replace(/[^\x00-\x7F]/g, '')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      .trim();
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
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; }
            a { color: #0066cc; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          ${tile.content}
        </body>
        </html>
      `;
      
      // Create UTF-8 plain text version
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = tile.content;
      const utf8Text = tempDiv.textContent || tempDiv.innerText || '';
      
      // Create ASCII-safe version for old applications
      const asciiText = sanitizeToAscii(utf8Text);
      
      // Try to write multiple formats to clipboard
      const clipboardItems = [];
      
      // Add HTML format
      clipboardItems.push({
        'text/html': new Blob([htmlContent], { type: 'text/html' })
      });
      
      // Add UTF-8 plain text
      clipboardItems.push({
        'text/plain': new Blob([utf8Text], { type: 'text/plain' })
      });
      
      // Try modern clipboard API with multiple formats
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([htmlContent], { type: 'text/html' }),
            'text/plain': new Blob([utf8Text], { type: 'text/plain' })
          })
        ]);
        
        // Also try to set ASCII version as fallback
        try {
          await navigator.clipboard.writeText(asciiText);
        } catch {
          // Ignore if this fails
        }
      } else {
        throw new Error('Modern clipboard API not available');
      }
      
      toast({
        title: "✓ Tekst gekopieerd",
        description: "Meerdere formaten naar klembord gekopieerd (HTML, UTF-8, ASCII)",
      });
    } catch (err) {
      console.error('Failed to copy with modern API:', err);
      
      // Fallback to legacy copy methods
      try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = tile.content;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        const asciiSafeText = sanitizeToAscii(plainText);
        
        // Use legacy execCommand as fallback
        const tempInput = document.createElement('textarea');
        tempInput.value = asciiSafeText;
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px';
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        
        toast({
          title: "✓ Tekst gekopieerd",
          description: "ASCII-veilige tekst naar klembord gekopieerd",
        });
      } catch (fallbackErr) {
        console.error('All copy methods failed:', fallbackErr);
        toast({
          title: "Kopiëren mislukt",
          description: "Kon tekst niet naar klembord kopiëren",
          variant: "destructive"
        });
      }
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