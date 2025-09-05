
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/auth/AuthForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const AuthPage = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Remove redirect for testing
  // if (user && !isLoading) {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background/70 to-background p-4">
      <div className="absolute top-4 left-4">
        <Link to="/">
          <Button variant="ghost">
            <span className="gradient-text mr-1">AI</span>
            <span>thlete</span>
          </Button>
        </Link>
      </div>
      
      <div className="w-full max-w-md">
        <Card className="border-border/40 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              <span className="gradient-text mr-1">AI</span>thlete
            </CardTitle>
            <CardDescription className="text-center">
              Your personal AI sports coach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <AuthForm type="login" />
              </TabsContent>
              <TabsContent value="register">
                <AuthForm type="register" />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              {activeTab === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setActiveTab('register')}
                    className="text-primary underline hover:text-primary/80"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setActiveTab('login')}
                    className="text-primary underline hover:text-primary/80"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
