import React from 'react';

const UserNotRegisteredError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-app-bg">
      <div className="max-w-md w-full p-8 bg-app-bg rounded-lg border border-app-border">
        <div className="text-center">
                    <h1 className="text-3xl font-normal text-app-text mb-4">Access restricted</h1>
          <p className="text-app-muted mb-8">
            You are not registered to use this application. Please contact the app administrator to request access.
          </p>
          <div className="p-4 bg-app-bg rounded-md text-sm text-app-muted">
            <p>If you believe this is an error, you can:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Verify you are logged in with the correct account</li>
              <li>Contact the app administrator for access</li>
              <li>Try logging out and back in again</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;
