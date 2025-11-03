import { Volleyball, ArrowRight, Plus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn, clearTokens } from "../lib/auth";

export default function Navbar() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const logged = isLoggedIn();
    const hideAuth = pathname === "/register" || pathname === "/login";

    function logout() {
        clearTokens();
        navigate("/login", { replace: true });
    }

    return (
        <header className="bg-primary text-white">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Volleyball className="h-6 w-6" />
                    <Link to="/" className="font-semibold">Sistema de Gestión de Ligas de Voleibol Chiapas</Link>
                </div>

                <div className="sm:flex items-center gap-4 text-sm">
                    {logged ? (
                        <>
                            <Link to="/dashboard" className="hover:underline">Panel</Link>
                            <button onClick={logout} className="rounded-md bg-white/10 px-3 py-1.5 hover:bg-white/20">
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        !hideAuth && (
                            <>
                                <Link to="/login" className="hover:underline">Iniciar Sesión <ArrowRight className="inline h-4 w-4" /></Link>
                                <Link to="/register" className="hover:underline">Registrarse <Plus className="inline h-4 w-4" /></Link>
                            </>
                        )
                    )}
                </div>
            </div>
        </header>
    );
}


