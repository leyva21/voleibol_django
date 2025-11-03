import { Users, IdCard, FileText, CreditCard, ShieldCheck, BarChart3 } from "lucide-react";

const features = [
    { title: "Gestión de Equipos", desc: "Registra y administra tus equipos de manera sencilla, varonil y femenil.", Icon: Users },
    { title: "Cédula Digital", desc: "Llena la cédula de inscripción en línea sin problemas de formato.", Icon: IdCard },
    { title: "Generación de PDF", desc: "Descarga cédulas en PDF listas para imprimir.", Icon: FileText },
    { title: "Pagos en Línea", desc: "Gestiona pagos de inscripción y credenciales de forma digital.", Icon: CreditCard },
    { title: "Control de Jugadores", desc: "Evita que un jugador se registre en múltiples equipos.", Icon: ShieldCheck },
    { title: "Estadísticas", desc: "Reportes y gráficas para presentar a la federación.", Icon: BarChart3 },
];

export default function Features() {
    return (
        <section className="py-12 md:py-16">
            <div className="mx-auto max-w-6xl px-4">
                <h2 className="text-center text-2xl md:text-3xl font-semibold">¿Qué ofrece nuestro sistema?</h2>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map(({ title, desc, Icon }) => (
                    <div key={title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow" >
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{desc}</p>
                    </div>
                ))}
                </div>
            </div>
        </section>
    );
}
