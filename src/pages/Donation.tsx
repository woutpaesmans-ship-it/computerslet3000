import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Copy, Heart, CreditCard, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Donation = () => {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const predefinedAmounts = [5, 10, 25, 50];
  const kbcAccount = "BE92 7360 0744 45523";

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Gekopieerd!",
        description: "Rekeningnummer is gekopieerd naar klembord",
      });
    } catch (err) {
      toast({
        title: "Fout",
        description: "Kon rekeningnummer niet kopiëren",
        variant: "destructive",
      });
    }
  };

  const handleStripeDonation = async (amount: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-donation', {
        body: { amount }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het verwerken van de donatie",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomDonation = () => {
    const amount = parseFloat(customAmount);
    if (amount && amount >= 1) {
      handleStripeDonation(amount);
    } else {
      toast({
        title: "Ongeldig bedrag",
        description: "Voer een geldig bedrag in (minimaal €1)",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <Heart className="text-red-500" />
            Steun Computerslet 3000
          </h1>
          <p className="text-muted-foreground">
            Vind je Computerslet 3000 handig of leuk? Overweeg dan een vrijwillige gift om de ontwikkeling te ondersteunen! 
            Elke bijdrage helpt ons om het programma te blijven verbeteren.
          </p>
        </div>

        <div className="space-y-6">
          {/* Bank Transfer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Bankovermaking (gratis)
              </CardTitle>
              <CardDescription>
                Maak een overmaking naar onze Belgische KBC-rekening
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                  <Label className="text-sm text-muted-foreground">Rekeningnummer:</Label>
                  <p className="font-mono text-lg font-semibold">{kbcAccount}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(kbcAccount)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Vermeld bij de mededeling: "Donatie Computerslet 3000"
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Online Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Online betaling (Stripe)
              </CardTitle>
              <CardDescription>
                Betaal veilig met creditcard, bancontact of andere betaalmethoden
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Predefined amounts */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Kies een bedrag:</Label>
                <div className="grid grid-cols-2 gap-3">
                  {predefinedAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => handleStripeDonation(amount)}
                      disabled={loading}
                      className="h-12 text-lg"
                    >
                      €{amount}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Custom amount */}
              <div className="space-y-3">
                <Label htmlFor="custom-amount" className="text-sm font-medium">
                  Of voer een eigen bedrag in:
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      €
                    </span>
                    <Input
                      id="custom-amount"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button
                    onClick={handleCustomDonation}
                    disabled={loading || !customAmount}
                    className="px-6"
                  >
                    {loading ? 'Bezig...' : 'Doneer'}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                * Online betalingen worden verwerkt door Stripe. Er kunnen transactiekosten van toepassing zijn.
              </p>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-lg font-semibold text-primary mb-2">
              Dank je wel voor je steun! ❤️
            </p>
            <p className="text-sm text-muted-foreground">
              Jouw bijdrage helpt ons om Computerslet 3000 nog beter te maken.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;