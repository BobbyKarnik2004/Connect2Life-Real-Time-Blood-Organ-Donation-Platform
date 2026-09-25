import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVerifyEmail } from '../hooks/useAuth';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { mutate: verifyEmail, isPending, isError, isSuccess } = useVerifyEmail();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      verifyEmail({ token });
    }
  }, [token, verifyEmail]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {isPending ? 'Verifying your email...' : isSuccess ? 'Email Verified!' : 'Email Verification'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isPending 
              ? 'Please wait while we verify your email address.'
              : isSuccess
              ? 'Your email has been successfully verified. You can now log in to your account.'
              : isError
              ? 'There was an error verifying your email. The link may have expired or is invalid.'
              : 'Please check your email for a verification link.'}
          </p>
        </div>
        
        {isSuccess && (
          <div className="mt-6">
            <button 
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </div>
        )}
        
        {isError && (
          <div className="mt-6">
            <button 
              className="w-full px-4 py-2 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              onClick={() => navigate('/resend-verification')}
            >
              Resend Verification Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
