import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { saveTokens } from "../lib/auth";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export default function Login() {
    const [form, setForm] = useState({ username: "", password: "" }); // username=email
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const navigate = useNavigate();

    function onChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function submit(e) {
        e.preventDefault();
        setErr(null);
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/auth/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
        });
        if (!res.ok) {
            let msg = "Credenciales inválidas";
            try {
                const data = await res.json();
                if (data?.detail) msg = data.detail;
            } catch {
                // ignore JSON parse errors
            }
            throw new Error(msg);
        }
        const data = await res.json(); // {access, refresh}
        saveTokens(data);
        navigate("/dashboard", { replace: true });
        } catch (e2) {
            setErr(e2.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-56px)] flex items-start justify-center bg-gray-50 py-12 px-4">
                <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-gray-200">
                <div className="rounded-t-2xl bg-primary text-white px-6 py-3 font-semibold text-xl">
                    Iniciar Sesión
                </div>

                <form onSubmit={submit} className="px-6 py-6 space-y-6">
                    <div>
                    <label className="block text-base font-medium mb-2">Correo Electrónico</label>
                    <input
                        name="username"
                        type="email"
                        value={form.username}
                        onChange={onChange}
                        placeholder="correo@ejemplo.com"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                    </div>

                    <div>
                    <label className="block text-base font-medium mb-2">Contraseña</label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={onChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Si te registraste, tu contraseña inicial es tu <b>teléfono</b>.
                    </p>
                    </div>

                    {err && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                        {err}
                    </div>
                    )}

                    <button
                    disabled={loading}
                    className="w-full rounded-xl bg-primary px-5 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary-dark disabled:opacity-60"
                    >
                    {loading ? "Ingresando..." : "Iniciar Sesión"}
                    </button>

                    <p className="text-center text-base text-gray-700">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className="text-primary hover:underline">
                        Regístrate aquí
                    </Link>
                    </p>
                </form>
                </div>
            </div>
        </>
    );
}
