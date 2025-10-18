import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated 404 Number */}
        <div className="space-y-4">
          <h1 className="text-9xl font-black text-indigo-600">404</h1>
          <div className="w-24 h-2 bg-indigo-300 rounded-full mx-auto"></div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Page not found</h2>
          <p className="text-lg text-gray-600">
            Pelo visto não encontramos a página que você queria... talvez você
            queira voltar para a página inicial?
          </p>
        </div>

        {/* Action Button */}
        <Button
          asChild
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
        >
          <Link to="/">Página inicial</Link>
        </Button>
      </div>
    </div>
  );
}
