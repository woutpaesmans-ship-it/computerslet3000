import { useState } from 'react';
import { Tile } from '@/types/tile';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t } = useLanguage();
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
      // Create clean HTML content optimized for Teams
      const cleanedContent = tile.content
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/>\s+</g, '><') // Remove spaces between tags
        .trim();
      
      const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;margin:0;padding:0;}a{color:#0066cc;text-decoration:none;}a:hover{text-decoration:underline;}</style></head><body>${cleanedContent}</body></html>`;
      
      // Create plain text with proper line breaks
      const tempDiv = document.createElement('div');
      const htmlWithLineBreaks = tile.content.replace(/<br\s*\/?>/gi, '\n');
      tempDiv.innerHTML = htmlWithLineBreaks;
      const rawText = tempDiv.textContent || tempDiv.innerText || '';
      // Clean up extra whitespace while preserving line breaks
      const plainText = rawText.replace(/[ \t]+/g, ' ').replace(/\n+/g, '\n').trim();
      
      // Create Markdown version (modern structured text)
      let markdownText = tile.content
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<b>(.*?)<\/b>/gi, '**$1**')
        .replace(/<em>(.*?)<\/em>/gi, '*$1*')
        .replace(/<i>(.*?)<\/i>/gi, '*$1*')
        .replace(/<a href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
        .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n')
        .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n')
        .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n')
        .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
        .replace(/<[^>]+>/g, ''); // Remove remaining HTML tags
      
      // Create RTF version (Rich Text Format - widely supported)
      const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}\\f0\\fs24 ${plainText.replace(/\n/g, '\\par ')}}`;
      
      // Try modern clipboard API with multiple formats
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([htmlContent], { type: 'text/html' }),
          'text/plain': new Blob([plainText], { type: 'text/plain' }),
          'text/markdown': new Blob([markdownText], { type: 'text/markdown' }),
          'text/rtf': new Blob([rtfContent], { type: 'text/rtf' })
        })
      ]);
      
      toast({
        title: t('tile.copied'),
        description: t('tile.copiedMultiFormat'),
      });
    } catch (err) {
      console.error('Failed to copy with modern API:', err);
      // Fallback to basic HTML + plain text
      try {
        // Recreate variables for fallback scope
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
        
        const tempDiv = document.createElement('div');
        const htmlWithLineBreaks = tile.content.replace(/<br\s*\/?>/gi, '\n');
        tempDiv.innerHTML = htmlWithLineBreaks;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([htmlContent], { type: 'text/html' }),
            'text/plain': new Blob([plainText], { type: 'text/plain' })
          })
        ]);
        
        toast({
          title: t('tile.copied'),
          description: t('tile.copiedHtmlPlain'),
        });
      } catch (fallbackErr) {
        // Ultimate fallback
        const tempDiv = document.createElement('div');
        const htmlWithLineBreaks = tile.content.replace(/<br\s*\/?>/gi, '\n');
        tempDiv.innerHTML = htmlWithLineBreaks;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        
        const tempInput = document.createElement('textarea');
        tempInput.value = plainText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        
        toast({
          title: t('tile.copied'),
          description: t('tile.copiedPlain'),
        });
      }
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
          title: t('tile.smsModified'),
          description: `${t('tile.smsCopied')} (${smsText.length}/1530 ${t('tile.characters')})`,
          variant: "destructive"
        });
      } else {
        toast({
          title: t('tile.smsCopied'),
          description: `${t('tile.smsCopied')} (${smsText.length}/1530 ${t('tile.characters')})`,
        });
      }
    } catch (err) {
      console.error('Failed to copy SMS version:', err);
      toast({
        title: t('tile.copyFailed'),
        description: t('tile.copyFailedDesc'),
        variant: "destructive"
      });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(t('tile.confirmDelete'))) {
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
              title={t('tile.copySms')}
            >
              <MessageSquare className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleEdit}
              title={t('tile.edit')}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              onClick={handleDelete}
              title={t('tile.deleteTooltip')}
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