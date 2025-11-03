import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-black text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-8 text-sm text-gray-600 md:grid-cols-3">
        <div>
          <p className="font-semibold text-white">Sistema de Gestión de Ligas de Voleibol Chiapas</p>
          <p className="mt-1 text-white">Facilita la gestión de ligas y torneos de voleibol en Chiapas.</p>
        </div>

        <div>
          <p className="font-semibold text-white">Enlaces</p>
          <ul className="mt-2 space-y-1">
            <li><Link to="/login" className="hover:underline text-white">Iniciar Sesión</Link></li>
            <li><Link to="/register" className="hover:underline text-white">Registrarse</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white">Contacto</p>
          <ul className="mt-2 space-y-1">
            <li className="text-white"><Mail className="inline mr-1" /> info@voleibolchiapas.com</li>
            <li className="text-white"><Phone className="inline mr-1" /> (961) 123 4567</li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-gray-500 text-white">
          © {new Date().getFullYear()} Sistema de Gestión de Ligas de Voleibol Chiapas. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
