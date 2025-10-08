import { Suspense } from 'react';
import ResetPasswordContent from './ResetPasswordContent';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary-darker">
        <div className="text-center text-white">
          <div className="h-8 w-8 animate-spin mx-auto mb-4 border-2 border-white border-t-transparent rounded-full" />
          <p>Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}