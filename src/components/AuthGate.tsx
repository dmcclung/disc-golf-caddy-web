import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Users, MessageCircle, MapPin, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthModal } from '@/hooks/useAuthModal';

interface AuthGateProps {
  children: ReactNode;
  feature: 'chat' | 'map' | 'conditions';
  title: string;
  description: string;
}

const featureIcons = {
  chat: MessageCircle,
  map: MapPin,
  conditions: AlertTriangle,
};

const featureBenefits = {
  chat: [
    'Connect with other disc golfers',
    'Get real-time course updates',
    'Share tips and experiences',
    'Ask questions about the course'
  ],
  map: [
    'See who\'s currently at the course',
    'Check in to let others know you\'re here',
    'View real-time user locations',
    'Find playing partners nearby'
  ],
  conditions: [
    'Report current course conditions',
    'See recent condition updates',
    'Help other players prepare',
    'Get severity ratings for weather conditions'
  ]
};

export const AuthGate = ({ children, feature, title, description }: AuthGateProps) => {
  const { isAuthenticated } = useAuth();
  const { open } = useAuthModal();
  const Icon = featureIcons[feature];
  const benefits = featureBenefits[feature];

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-[400px]">
      {/* Blurred preview of actual content */}
      <div className="absolute inset-0 blur-sm opacity-30 pointer-events-none overflow-hidden max-h-[400px]">
        <div className="overflow-hidden max-h-[400px]">
          {children}
        </div>
      </div>
      {/* Auth gate overlay */}
      <Card className="relative bg-background/95 backdrop-blur-sm border rounded-lg p-6">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="text-base mt-2">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              What you'll get:
            </h4>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col gap-3 pt-4 border-t">
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => open('signup')}
            >
              <Users className="w-4 h-4 mr-2" />
              Sign Up Now - It's Free!
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Already have an account?{' '}
              <button 
                onClick={() => open('signin')} 
                className="text-primary hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};