import React, { type ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logError } from "@/utils/logger";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError("Uncaught error in component tree", {
      error,
      componentStack: errorInfo.componentStack,
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-red-200">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>

              <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Algo deu errado
              </h1>

              <p className="text-center text-gray-600 mb-4">
                Desculpe, algo inesperado aconteceu. Tente recarregar a página
                ou volte para a página inicial.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <div className="mb-6 p-3 bg-gray-100 rounded border border-gray-300">
                  <p className="text-xs font-mono text-gray-700 whitespace-pre-wrap break-words">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={this.resetError}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar novamente
                </Button>

                <Button
                  onClick={() => {
                    window.location.href = "/";
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Voltar para o início
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
