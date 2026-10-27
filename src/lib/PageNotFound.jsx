import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';


export default function PageNotFound({}) {
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    const { data: authData, isFetched } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const user = await base44.auth.me();
                return { user, isAuthenticated: true };
            } catch (error) {
                return { user: null, isAuthenticated: false };
            }
        }
    });
    
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-app-bg">
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">
                    {/* 404 Error Code */}
                    <div className="space-y-2">
                        <h1 className="text-7xl font-light text-app-muted">404</h1>
                        <div className="h-0.5 w-16 bg-app-surface mx-auto"></div>
                    </div>
                    
                    {/* Main Message */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-medium text-app-text">
                            Page Not Found
                        </h2>
                        <p className="text-app-muted leading-relaxed">
                            The page <span className="font-medium text-app-text">"{pageName}"</span> could not be found in this application.
                        </p>
                    </div>
                    
                    {/* Admin Note */}
                    {isFetched && authData.isAuthenticated && authData.user?.role === 'admin' && (
                        <div className="mt-8 p-4 bg-app-surface rounded-lg border border-app-border">
                            <div className="flex items-start space-x-3">
                                <div className="text-left space-y-1">
                                    <p className="text-sm font-medium text-app-text">Admin note</p>
                                    <p className="text-sm text-app-muted leading-relaxed">
                                        This could mean that the AI hasn't implemented this page yet. Ask it to implement it in the chat.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Action Button */}
                    <div className="pt-6">
                        <button 
                            onClick={() => window.location.href = '/'} 
                            className="sf-press inline-flex items-center min-h-11 px-5 text-[0.9375rem] font-semibold text-app-on-primary bg-app-primary rounded-sm"
                        >
                            Go to My business
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}