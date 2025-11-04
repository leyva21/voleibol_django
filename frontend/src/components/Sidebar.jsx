import { Link, useLocation } from "react-router-dom";
import {
    Home,
    Users,
    Trophy,
    CreditCard,
    IdCard,
    BarChart2,
    MessageSquare,
    Settings,
} from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const { pathname } = useLocation();

    const menu = [
        { icon: <Home />, label: "Dashboard", path: "/dashboard" },
        { icon: <Users />, label: "Gestión de Equipos", path: "/equipos" },
        { icon: <Users />, label: "Jugadores", path: "/jugadores" },
        { icon: <Trophy />, label: "Ligas/Torneos", path: "/ligas" },
        { icon: <CreditCard />, label: "Control de Pagos", path: "/pagos" },
        { icon: <IdCard />, label: "Credencialización", path: "/credenciales" },
        { icon: <BarChart2 />, label: "Reportes y Estadísticas", path: "/reportes" },
        { icon: <MessageSquare />, label: "Comunicaciones", path: "/comunicaciones" },
        { icon: <Settings />, label: "Configuración", path: "/configuracion" },
    ];

    return (
        <aside
            className={`fixed md:static top-0 left-0 h-full md:h-auto z-40 bg-white shadow-md border-r border-gray-200 p-4 overflow-y-auto transition-transform duration-300
        ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-64"}
      `}
        >
            <h1 className="text-blue-600 font-bold text-lg mb-6">Sistema de Gestión</h1>

            <ul className="space-y-2 text-gray-700">
                {menu.map((item, i) => {
                    const active = pathname.startsWith(item.path);
                    return (
                        <li key={i}>
                            <Link
                                to={item.path}
                                onClick={() => setSidebarOpen(false)} 
                                className={`flex items-center gap-2 rounded p-2 transition-colors ${active
                                        ? "bg-blue-100 text-blue-700 font-semibold"
                                        : "hover:bg-blue-50"
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}
