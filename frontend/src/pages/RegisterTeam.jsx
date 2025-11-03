import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
const MAX_MB = 5;
const validProofExt = ["jpg","jpeg","png","pdf","doc","docx"];
const validLogoExt  = ["jpg","jpeg","png","gif"];


function fileExt(name) {
    const i = name.lastIndexOf(".");
    return i >= 0 ? name.slice(i+1).toLowerCase() : "";
}

export default function RegisterTeam() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        team_name: "",
        category: "",
        payment_reference: "",
        delegate_name: "",
        email: "",
        address: "",
        phone: "",
    });
    const [logo, setLogo] = useState(null);
    const [proof, setProof] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [err, setErr] = useState(null);

    function onChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function onFile(setter, allowExt) {
        return (e) => {
        const f = e.target.files?.[0];
        if (!f) return setter(null);
        const ext = fileExt(f.name);
        if (!allowExt.includes(ext)) {
            setErr(`Formato no permitido (.${ext}). Permitidos: ${allowExt.join(", ")}`);
            e.target.value = "";
            return;
        }
        if (f.size > MAX_MB * 1024 * 1024) {
            setErr(`El archivo supera ${MAX_MB}MB.`);
            e.target.value = "";
            return;
        }
        setErr(null);
        setter(f);
        };
    }

    async function submit(e) {
        e.preventDefault();
        setMsg(null); setErr(null);

        if (!form.category) return setErr("Selecciona la categoría.");
        if (!proof) return setErr("Adjunta el comprobante de pago.");

        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (logo)  fd.append("logo", logo);
        if (proof) fd.append("payment_proof", proof);

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/registrations/`, {
                method: "POST",
                body: fd,
            });
            if (!res.ok) {
                let detail = "Error al registrar";
                try {
                    const data = await res.json();
                // mostrar errores de DRF si vienen por campo
                if (typeof data === "object") {
                    const firstKey = Object.keys(data)[0];
                    if (firstKey) detail = Array.isArray(data[firstKey]) ? data[firstKey][0] : JSON.stringify(data);
                }
                } catch(_) {
                    console.error("Error al procesar la respuesta:", _);
                }
                throw new Error(detail);
            }
            setMsg("¡Registro enviado! Usuario: tu correo. Contraseña inicial: tu teléfono. Cambia la contraseña después del primer acceso.");
            setForm({
                team_name: "", category: "", payment_reference: "",
                delegate_name: "", email: "", address: "", phone: "",
            });
            setLogo(null); setProof(null);
            const logoEl = document.getElementById("logo"); if (logoEl) logoEl.value = "";
            const proofEl = document.getElementById("proof"); if (proofEl) proofEl.value = "";
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 600);
        } catch (e2) {
            setErr(e2.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />
            <div className="mx-auto max-w-6xl p-6 md:p-8">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl">
                <div className="rounded-t-2xl bg-primary text-white px-8 py-4 font-semibold text-xl md:text-2xl">
                    Registro de Equipo y Delegado
                </div>

                <form onSubmit={submit} className="px-8 py-8 space-y-10 text-lg">
                <section>
                    <h3 className="text-primary font-semibold mb-4 text-2xl">Datos del Equipo</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-base font-medium mb-2">Nombre del Equipo *</label>
                            <input name="team_name" value={form.team_name} onChange={onChange} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Nombre del equipo" required />
                            <p className="text-xs text-gray-600 mt-1">Mínimo 3 caracteres. Solo letras, números y espacios.</p>
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-2">Categoría *</label>
                            <select name="category" value={form.category} onChange={onChange} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary" required >
                                <option value="">Seleccione una categoría</option>
                                <option value="M">Varonil</option>
                                <option value="F">Femenil</option>
                            </select>
                            <p className="text-xs text-gray-600 mt-1">Seleccione la categoría en la que participará su equipo.</p>
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-2">Comprobante de Pago *</label>
                            <input id="proof" type="file" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" onChange={onFile(setProof, validProofExt)} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg bg-white file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white" required />
                            <p className="text-xs text-gray-600 mt-1">Formatos: JPG, PNG, PDF, DOC. Máx: {MAX_MB}MB</p>
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-2">Número de Referencia de Pago *</label>
                            <input name="payment_reference" value={form.payment_reference} onChange={onChange} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Folio o transacción" required />
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-2">Logo del Equipo (Opcional)</label>
                            <input id="logo" type="file" accept=".jpg,.jpeg,.png,.gif" onChange={onFile(setLogo, validLogoExt)} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg bg-white file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white" />
                            <p className="text-xs text-gray-600 mt-1">Formatos: JPG, PNG, GIF. Máx: {MAX_MB}MB</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-primary font-semibold mb-4 text-2xl">Datos del Delegado/Entrenador</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-base font-medium mb-2">Nombre Completo *</label>
                            <input name="delegate_name" value={form.delegate_name} onChange={onChange} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Nombre y apellidos" required />
                            <p className="text-xs text-gray-600 mt-1">Mínimo 5 caracteres. Solo letras y espacios.</p>
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-2">Dirección *</label>
                            <input name="address" value={form.address} onChange={onChange} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Calle, número, colonia" required />
                            <p className="text-xs text-gray-600 mt-1">Mínimo 10 caracteres.</p>
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-2">Correo Electrónico *</label>
                            <input type="email" name="email" value={form.email} onChange={onChange} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="correo@ejemplo.com" required />
                            <p className="text-xs text-gray-600 mt-1">Será tu usuario para iniciar sesión.</p>
                        </div>

                        <div>
                            <label className="block text-base font-medium mb-2">Teléfono/Celular *</label>
                            <input name="phone" value={form.phone} onChange={onChange} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="10 dígitos" required />
                            <p className="text-xs text-gray-600 mt-1">Será tu contraseña inicial.</p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl bg-teal-50 px-5 py-4 text-base text-teal-900 border border-teal-200 shadow">
                        <strong>Importante:</strong> Su contraseña será su número de teléfono. Asegúrese de recordarlo para iniciar sesión.
                    </div>
                </section>

                {err && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">{err}</div>}
                {msg && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">{msg}</div>}

                <div className="pt-2">
                    <button disabled={loading} className="w-full rounded-xl bg-primary px-5 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary-dark disabled:opacity-60" >
                    {loading ? "Registrando..." : "Registrar Equipo y Usuario"}
                    </button>
                </div>

                <p className="text-center text-base text-gray-700">
                    ¿Ya tienes cuenta?{" "}
                    <a className="text-primary hover:underline" href="/login">Inicia sesión aquí</a>
                </p>
                </form>
            </div>
            </div>
        </>
    );
}
