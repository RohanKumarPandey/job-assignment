'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center bg-mesh-gradient">
      <SignUp
        path="/sign-up"
        routing="path"
        appearance={{
          variables: {
            colorPrimary: 'hsl(263, 70%, 62%)',
            colorBackground: 'hsl(222, 35%, 12%)',
            colorText: 'hsl(210, 40%, 98%)',
            colorInputBackground: 'hsl(222, 28%, 18%)',
            colorInputText: 'hsl(210, 40%, 98%)',
            borderRadius: '0.75rem',
          },
        }}
      />
    </div>
  );
}
