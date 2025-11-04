import {Users,User,UserRound,UserCheck,Clock,Settings,Trophy,Wallet,IdCard,BarChart3,CheckCircle2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const COLORS = {
    blue: {
        border: "border-blue-400",
        text: "text-blue-600",
        hover: "hover:bg-blue-500",
        active: "bg-blue-600 text-white",
    },
    gray: {
        border: "border-gray-300",
        text: "text-gray-600",
        hover: "hover:bg-gray-500",
        active: "bg-gray-600 text-white",
    },
    green: {
        border: "border-green-400",
        text: "text-green-600",
        hover: "hover:bg-green-500",
        active: "bg-green-600 text-white",
    },
    yellow: {
        border: "border-yellow-400",
        text: "text-yellow-600",
        hover: "hover:bg-yellow-500",
        active: "bg-yellow-600 text-white",
    },
    cyan: {
        border: "border-cyan-400",
        text: "text-cyan-600",
        hover: "hover:bg-cyan-500",
        active: "bg-cyan-600 text-white",
    },
    black: {
        border: "border-gray-400",
        text: "text-black",
        hover: "hover:bg-black",
        active: "bg-black text-white",
    },
};

function ActionLink({ to, icon, label, color, pathname }) {
    const c = COLORS[color];
    const isActive = pathname.startsWith(to);

    return (
        <Link
            to={to}
            className={[
                "group w-full border rounded py-2 px-2 flex items-center justify-center gap-2",
                "font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                c.border,
                isActive ? c.active : c.text,
                c.hover,
                "hover:text-white",
            ].join(" ")}
        >
            <span className="transition-colors">{icon}</span>
            <span>{label}</span>
        </Link>
    );
}

export default function Dashboard() {
    const { pathname } = useLocation();

    const summaryCards = [
        { label: "Equipos Registrados", color: "text-blue-600", icon: <Users size={36} /> },
        { label: "Varoniles", color: "text-cyan-500", icon: <User size={36} /> },
        { label: "Femeniles", color: "text-pink-500", icon: <UserRound size={36} /> },
        { label: "Jugadores", color: "text-green-600", icon: <UserCheck size={36} /> },
        { label: "Pendientes", color: "text-yellow-500", icon: <Clock size={36} /> },
        { label: "Usuarios por activar", color: "text-gray-600", icon: <UserCheck size={36} /> },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Administración</h1>
            {/* Tarjetas  */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-10">
                {summaryCards.map(({ label, color, icon }, i) => (
                    <div
                        key={i}
                        className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
                    >
                        <div className={`${color} mb-3`}>{icon}</div>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                        <p className="font-semibold text-gray-700">{label}</p>
                    </div>
                ))}
            </div>
            {/* Secciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white border border-gray-200 rounded-lg shadow">
                    <h2 className="bg-gray-700 text-white px-4 py-2 rounded-t flex items-center gap-2">
                        <Clock size={18} /> Usuarios Pendientes de Activación
                    </h2>
                    <div className="p-6 text-center text-gray-600">
                        <CheckCircle2 size={36} className="mx-auto text-green-600 mb-2" />
                        <p>No hay usuarios pendientes de activación</p>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow">
                    <h2 className="bg-yellow-500 text-white px-4 py-2 rounded-t flex items-center gap-2">
                        <Users size={18} /> Equipos Pendientes de Validación
                    </h2>
                    <div className="p-6 text-center text-gray-600">
                        <CheckCircle2 size={36} className="mx-auto text-green-600 mb-2" />
                        <p>No hay equipos pendientes de validación</p>
                    </div>
                </div>
            </div>
            {/* Últimos equipos y acciones rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow">
                    <h2 className="bg-blue-600 text-white px-4 py-2 rounded-t flex items-center gap-2">
                        <Users size={18} /> Últimos Equipos Registrados
                    </h2>
                    <div className="p-6 text-center text-gray-600">
                        <Users size={36} className="mx-auto mb-2 text-gray-500" />
                        <p>No hay equipos registrados</p>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow">
                    <h2 className="bg-cyan-400 text-white px-4 py-2 rounded-t flex items-center gap-2">
                        <Settings size={18} /> Acciones Rápidas
                    </h2>
                    <div className="p-4 flex flex-col space-y-2">
                        <ActionLink
                            to="/equipos"
                            icon={<Users size={16} />}
                            label="Gestionar Equipos"
                            color="blue"
                            pathname={pathname}
                        />
                        <ActionLink
                            to="/jugadores"
                            icon={<UserRound size={16} />}
                            label="Buscar Jugadores"
                            color="gray"
                            pathname={pathname}
                        />
                        <ActionLink
                            to="/jugadores"
                            icon={<UserCheck size={16} />}
                            label="Gestionar Usuarios"
                            color="green"
                            pathname={pathname}
                        />
                        <ActionLink
                            to="/pagos"
                            icon={<Wallet size={16} />}
                            label="Control de Pagos"
                            color="yellow"
                            pathname={pathname}
                        />
                        <ActionLink
                            to="/credenciales"
                            icon={<IdCard size={16} />}
                            label="Credencialización"
                            color="cyan"
                            pathname={pathname}
                        />
                        <ActionLink
                            to="/reportes"
                            icon={<BarChart3 size={16} />}
                            label="Generar Reportes"
                            color="black"
                            pathname={pathname}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
