import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleClearData = () => {
    if (window.confirm("This will clear your local game data to fix the glitch. Are you sure?")) {
        localStorage.clear();
        window.location.reload();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-4 border-yellow-400 relative overflow-hidden">
            
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#F59E0B 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>

            <div className="relative z-10">
                <div className="text-8xl mb-6 animate-bounce">🙈</div>
                
                <h1 className="text-3xl font-black text-gray-800 mb-4">Uh oh! Glitch in the System!</h1>
                
                <p className="text-gray-600 font-bold text-lg mb-8">
                  The monkeys pulled the wrong plug in the server room. Don't worry, we can fix it!
                </p>

                <div className="bg-red-50 border-2 border-red-100 rounded-xl p-4 mb-8 text-left">
                    <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest mb-1">
                        <AlertTriangle size={14} /> Error Details
                    </div>
                    <code className="text-xs text-red-800 font-mono block break-words">
                        {this.state.error?.message || "Unknown Error"}
                    </code>
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={this.handleReload}
                        className="w-full bg-kid-primary text-yellow-900 font-black py-4 rounded-2xl shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy text-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors"
                    >
                        <RefreshCcw size={24} /> Reload App
                    </button>
                    
                    <button 
                        onClick={this.handleClearData}
                        className="w-full bg-transparent text-gray-400 font-bold py-2 hover:text-red-500 text-sm"
                    >
                        Hard Reset (Clear Data)
                    </button>
                </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;