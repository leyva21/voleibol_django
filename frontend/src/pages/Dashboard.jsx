import Navbar from "../components/Navbar";

export default function Dashboard() {
    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-56px)] bg-gray-50">
                <div className="mx-auto max-w-6xl p-6">
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl p-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-primary">Bienvenido, Leyva</h1>
                        <p className="mt-4 text-lg text-gray-700">
                            Este es tu panel principal. Desde aquí podrás gestionar equipos, jugadores y torneos.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
