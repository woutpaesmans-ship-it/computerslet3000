import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Copy, Heart, CreditCard, Banknote, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Donation = () => {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const predefinedAmounts = [5, 10, 25, 50];
  const kbcAccount = "BE92 7360 0744 45523";

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: t('donation.copied'),
        description: t('donation.copySuccess'),
      });
    } catch (err) {
      toast({
        title: t('common.error'),
        description: t('donation.copyError'),
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
        title: t('common.error'),
        description: t('donation.processError'),
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
        title: t('donation.invalidAmount'),
        description: t('donation.minAmount'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4 relative">
      {/* Back button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 rounded-full h-12 w-12 border-2 shadow-lg hover:scale-105 transition-transform"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <Heart className="text-red-500" />
            {t('donation.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('donation.description')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Bank Transfer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                {t('donation.bankTransfer')}
              </CardTitle>
              <CardDescription>
                {t('donation.bankDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                  <Label className="text-sm text-muted-foreground">{t('donation.accountNumber')}</Label>
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
                {t('donation.reference')}
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Online Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t('donation.onlinePayment')}
              </CardTitle>
              <CardDescription>
                {t('donation.onlineDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Predefined amounts */}
              <div>
                <Label className="text-sm font-medium mb-3 block">{t('donation.amount')}:</Label>
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
                  {t('donation.custom')}:
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
                    {loading ? t('donation.processing') : t('donation.donate')}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {t('donation.stripeNotice')}
              </p>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-lg font-semibold text-primary mb-2">
              {t('donation.thankYou')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('donation.helpText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;