import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Heart, Home } from "lucide-react";

const DonationSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4 flex items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            Bedankt voor je donatie! 
            <Heart className="h-6 w-6 text-red-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Je betaling is succesvol verwerkt. We waarderen je steun enorm!
          </p>
          <p className="text-sm text-muted-foreground">
            Je bijdrage helpt ons om Computerslet 3000 te blijven ontwikkelen en verbeteren.
          </p>
          
          <div className="pt-4">
            <Button onClick={() => navigate('/')} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Terug naar Computerslet 3000
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Je wordt automatisch doorgestuurd over 10 seconden...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationSuccess;