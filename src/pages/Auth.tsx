import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Helper function to translate Supabase error messages
const translateError = (error: string, t: (key: string) => string): string => {
  const errorMap: { [key: string]: string } = {
    'Invalid login credentials': t('auth.error.invalidCredentials'),
    'User already registered': t('auth.error.userExists'),
    'Email not confirmed': t('auth.error.emailNotConfirmed'),
    'Password should be at least 6 characters': t('auth.error.passwordTooShort'),
    'Invalid email': t('auth.error.invalidEmail'),
    'For security purposes, you can only request this': t('auth.error.rateLimited'),
    'Email link is invalid or has expired': t('auth.error.linkExpired'),
    'New password should be different': t('auth.error.samePassword'),
  };

  for (const [key, value] of Object.entries(errorMap)) {
    if (error.includes(key)) {
      return value;
    }
  }
  
  return error;
};

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const { toast } = useToast();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is coming from a password recovery link
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
      }
    });
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !isRecoveryMode) {
      navigate('/');
    }
  }, [user, navigate, isRecoveryMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: t('auth.loginError'),
          description: translateError(error.message, t),
          variant: "destructive",
        });
      } else {
        toast({
          title: t('auth.loginSuccess'),
          description: t('auth.loginSuccessDesc'),
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.error'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        toast({
          title: t('auth.signupError'),
          description: translateError(error.message, t),
          variant: "destructive",
        });
      } else {
        toast({
          title: t('auth.signupSuccess'),
          description: t('auth.signupSuccessDesc'),
        });
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.error'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/auth`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: redirectUrl
      });

      if (error) {
        toast({
          title: t('auth.resetPasswordError'),
          description: translateError(error.message, t),
          variant: "destructive",
        });
      } else {
        toast({
          title: t('auth.resetPasswordSuccess'),
          description: t('auth.resetPasswordSuccessDesc'),
        });
        setResetEmail('');
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.error'),
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: t('auth.passwordsDoNotMatch'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast({
          title: t('auth.passwordUpdateError'),
          description: translateError(error.message, t),
          variant: "destructive",
        });
      } else {
        toast({
          title: t('auth.passwordUpdated'),
          description: t('auth.passwordUpdatedDesc'),
        });
        setIsRecoveryMode(false);
        navigate('/');
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.error'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4">
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
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t('header.title')}</CardTitle>
          <CardDescription>
            {isRecoveryMode ? t('auth.updatePassword') : t('auth.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isRecoveryMode ? (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">{t('auth.newPassword')}</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t('auth.confirmPassword')}</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('donation.processing') : t('auth.updatePasswordButton')}
              </Button>
            </form>
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
                <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                {!showResetForm ? (
                  <>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('auth.email')}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">{t('auth.password')}</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? t('donation.processing') : t('auth.loginButton')}
                      </Button>
                    </form>
                    <div className="mt-4 text-center">
                      <button
                        type="button"
                        onClick={() => setShowResetForm(true)}
                        className="text-sm text-primary hover:underline"
                      >
                        {t('auth.forgotPassword')}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">{t('auth.email')}</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                          placeholder={t('auth.email')}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={resetLoading}>
                        {resetLoading ? t('donation.processing') : t('auth.resetPasswordButton')}
                      </Button>
                    </form>
                    <div className="mt-4 text-center">
                      <button
                        type="button"
                        onClick={() => setShowResetForm(false)}
                        className="text-sm text-primary hover:underline"
                      >
                        {t('auth.backToLogin')}
                      </button>
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t('auth.email')}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t('auth.password')}</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t('donation.processing') : t('auth.signupButton')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}