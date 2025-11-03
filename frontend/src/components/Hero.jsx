export default function Hero() {
    return (
        <section className="bg-gray-50">
            <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8">
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                        Sistema de Gestión para <span className="text-primary">Ligas de Voleibol</span>
                    </h1>
                    <p className="mt-4 text-gray-600 max-w-2xl">
                        Facilitamos la administración de documentación para torneos y ligas
                        de voleibol en el estado de Chiapas.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <a
                        href="/register"
                        className="inline-flex items-center rounded-lg bg-primary px-4 py-2 font-medium text-white shadow hover:bg-primary-dark"
                        >
                        Registrarse
                        </a>
                        <a
                        href="/login"
                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-800 hover:bg-gray-100"
                        >
                        Iniciar Sesión
                        </a>
                    </div>
                </div>

                <div className="md:col-span-4 flex justify-center">
                    {/* Cambia la ruta por tu logo real */}
                    <img src="/logo_chiapas.png" alt="Voleibol Chiapas" className="h-16 opacity-80" onError={(e)=>{e.currentTarget.style.display='none'}}/>
                </div>
            </div>
        </section>
    );
}
