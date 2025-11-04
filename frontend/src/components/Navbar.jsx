import { Volleyball, ArrowRight, Plus, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn, clearTokens } from "../lib/auth";

export default function Navbar({ onToggleSidebar }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logged = isLoggedIn();
  const hideAuth = pathname === "/register" || pathname === "/login";

  function logout() {
    clearTokens();
    navigate("/login", { replace: true });
  }

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header className={`bg-blue-600 text-white shadow-md`}>
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isDashboard && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden flex items-center"
            >
              <Menu size={24} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <Volleyball className="h-6 w-6" />
            <Link to="/" className="font-semibold">
              Sistema de Gestión de Ligas de Voleibol Chiapas
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {logged ? (
            <>
              <Link to="/dashboard" className="hover:underline">
                Panel
              </Link>
              <button
                onClick={logout}
                className="rounded-md bg-white/10 px-3 py-1.5 hover:bg-white/20 transition"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            !hideAuth && (
              <>
                <Link
                  to="/login"
                  className="hover:underline flex items-center gap-1"
                >
                  Iniciar Sesión
                  <ArrowRight className="inline h-4 w-4" />
                </Link>
                <Link
                  to="/register"
                  className="hover:underline flex items-center gap-1"
                >
                  Registrarse
                  <Plus className="inline h-4 w-4" />
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}
