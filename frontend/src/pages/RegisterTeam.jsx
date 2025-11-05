import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { createRegistration } from "../api.js";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
const MAX_MB = 5;
const validProofExt = ["jpg", "jpeg", "png", "pdf", "doc", "docx"];
const validLogoExt = ["jpg", "jpeg", "png", "gif"];

function fileExt(name) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

export default function RegisterTeam() {
  const PASS_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  const navigate = useNavigate();
  const [logo, setLogo] = useState(null);
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);

  const [form, setForm] = useState({
    team_name: "", category: "", payment_reference: "",
    delegate_name: "", email: "", address: "", phone: "",
    password: "", password_confirm: "",            // ⬅️ nuevos
  });
  const [passErr, setPassErr] = useState(null);

  const PHONE_RE = /^\d{10}$/;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [fieldErrors, setFieldErrors] = useState({ email: null, phone: null });

  function onlyDigits(s) {
    return s.replace(/\D/g, "");
  }

  function onChange(e) {
    const { name, value } = e.target;

    if (name === "phone") {
      const digits = onlyDigits(value).slice(0, 10);
      setForm((s) => ({ ...s, phone: digits }));
      setFieldErrors((s) => ({
        ...s,
        phone: digits && !PHONE_RE.test(digits) ? "El teléfono debe tener exactamente 10 dígitos." : null,
      }));
      return;
    }

    if (name === "email") {
      const trimmed = value.trim();
      setForm((s) => ({ ...s, email: trimmed }));
      setFieldErrors((s) => ({
        ...s,
        email: trimmed && !EMAIL_RE.test(trimmed) ? "Correo no válido." : null,
      }));
      return;
    }

    if (name === "password" || name === "password_confirm") {
      setForm((s) => ({ ...s, [name]: value }));

      const pass = name === "password" ? value : form.password;
      const confirm = name === "password_confirm" ? value : form.password_confirm;

      if (!PASS_RE.test(pass)) {
        setPassErr("Mín. 8 caracteres, incluir al menos una letra y un número.");
      } else if (confirm && pass !== confirm) {
        setPassErr("Las contraseñas no coinciden.");
      } else {
        setPassErr(null);
      }
      return;
    }

    setForm((s) => ({ ...s, [name]: value }));
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

  // 🔍 Verificar comprobante con OCR
  async function verifyProof(file) {
    const fd = new FormData();
    fd.append("file", file);
    setMsg(null);
    setErr(null);
    setOcrResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/verify-receipt/`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      if (res.ok && data.verified) {
        setOcrResult(data);
        setMsg(`✅ Comprobante verificado (confianza: ${(data.confidence * 100).toFixed(1)}%)`);
      } else {
        setOcrResult(null);
        setErr(`⚠️ No parece un comprobante válido (confianza: ${(data.confidence * 100).toFixed(1)}%)`);
      }
    } catch (e) {
      setOcrResult(null);
      setErr(`Error al verificar el comprobante. ${e.message}`);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    if (!form.category) return setErr("Selecciona la categoría.");
    if (!proof) return setErr("Adjunta el comprobante de pago.");
    if (!EMAIL_RE.test(form.email)) {
      return setErr("Correo no válido.");
    }
    if (!PHONE_RE.test(form.phone)) {
      return setErr("El teléfono debe tener exactamente 10 dígitos.");
    }
    if (!PASS_RE.test(form.password)) {
      return setErr("La contraseña no cumple los requisitos.");
    }
    if (form.password !== form.password_confirm) {
      return setErr("Las contraseñas no coinciden.");
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (logo) fd.append("logo", logo);
    if (proof) fd.append("payment_proof", proof);

    await createRegistration(fd);

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
          if (typeof data === "object") {
            const firstKey = Object.keys(data)[0];
            if (firstKey)
              detail = Array.isArray(data[firstKey])
                ? data[firstKey][0]
                : JSON.stringify(data);
          }
        } catch (_) {
          console.error("Error al procesar la respuesta:", _);
        }
        throw new Error(detail);
      }
      setMsg("¡Registro enviado! Usuario: tu correo. Contraseña inicial: tu teléfono. Cambia la contraseña después del primer acceso.");
      setForm({
        team_name: "",
        category: "",
        payment_reference: "",
        delegate_name: "",
        email: "",
        address: "",
        phone: "",
      });
      setLogo(null);
      setProof(null);
      setOcrResult(null);
      const logoEl = document.getElementById("logo");
      if (logoEl) logoEl.value = "";
      const proofEl = document.getElementById("proof");
      if (proofEl) proofEl.value = "";
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 800);
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
                  <input
                    name="team_name"
                    value={form.team_name}
                    onChange={onChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nombre del equipo"
                    required
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Mínimo 3 caracteres. Solo letras, números y espacios.
                  </p>
                </div>

                <div>
                  <label className="block text-base font-medium mb-2">Categoría *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={onChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Seleccione una categoría</option>
                    <option value="M">Varonil</option>
                    <option value="F">Femenil</option>
                  </select>
                </div>

                {/* 📎 Verificación OCR del comprobante */}
                <div>
                  <label className="block text-base font-medium mb-2">Comprobante de Pago *</label>
                  <input
                    id="proof"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return setProof(null);
                      const ext = fileExt(f.name);
                      if (!validProofExt.includes(ext)) {
                        setErr(`Formato no permitido (.${ext}). Permitidos: ${validProofExt.join(", ")}`);
                        e.target.value = "";
                        return;
                      }
                      if (f.size > MAX_MB * 1024 * 1024) {
                        setErr(`El archivo supera ${MAX_MB}MB.`);
                        e.target.value = "";
                        return;
                      }
                      setProof(f);
                      verifyProof(f); // 🚀 Verificar comprobante
                    }}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg bg-white file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white"
                    required
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Formatos: JPG, PNG, PDF, DOC. Máx: {MAX_MB}MB
                  </p>
                </div>

                <div>
                  <label className="block text-base font-medium mb-2">Número de Referencia de Pago *</label>
                  <input
                    name="payment_reference"
                    value={form.payment_reference}
                    onChange={onChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Folio o transacción"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-medium mb-2">Logo del Equipo (Opcional)</label>
                  <input
                    id="logo"
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={onFile(setLogo, validLogoExt)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg bg-white file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Formatos: JPG, PNG, GIF. Máx: {MAX_MB}MB
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-primary font-semibold mb-4 text-2xl">Datos del Delegado/Entrenador</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-base font-medium mb-2">Nombre Completo *</label>
                  <input
                    name="delegate_name"
                    value={form.delegate_name}
                    onChange={onChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nombre y apellidos"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-medium mb-2">Dirección *</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={onChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Calle, número, colonia"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-medium mb-2">Correo Electrónico *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    className={`w-full rounded-lg border px-4 py-3 text-lg focus:outline-none focus:ring-2 ${fieldErrors.email ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-primary"}`}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                  {fieldErrors.email && <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-base font-medium mb-2">Teléfono/Celular *</label>
                  <input
                    type="tel"
                    name="phone"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={10}
                    value={form.phone}
                    onChange={onChange}
                    className={`w-full rounded-lg border px-4 py-3 text-lg focus:outline-none focus:ring-2 ${fieldErrors.phone ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-primary"}`}
                    placeholder="10 dígitos"
                    required
                  />
                  {fieldErrors.phone && <p className="text-sm text-red-600 mt-1">{fieldErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-base font-medium mb-2">Contraseña *</label>
                  <input type="password" name="password" value={form.password} onChange={onChange} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Mín. 8 caracteres" required />
                  <p className="text-sm text-gray-600 mt-1">
                    Debe incluir al menos una <b>letra</b> y un <b>número</b>.
                  </p>
                </div>

                <div>
                  <label className="block text-base font-medium mb-2">Confirmar Contraseña *</label>
                  <input type="password" name="password_confirm" value={form.password_confirm} onChange={onChange} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Repite tu contraseña" required/>
                </div>
              </div>

            </section>

            {err && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                {err}
              </div>
            )}
            {msg && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
                {msg}
              </div>
            )}

            {passErr && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800 mt-2">
                {passErr}
              </div>
            )}

            <div className="pt-2">
              <button
                disabled={loading || !ocrResult?.verified}
                className="w-full rounded-xl bg-primary px-5 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary-dark disabled:opacity-60"
              >
                {loading
                  ? "Registrando..."
                  : ocrResult?.verified
                  ? "Registrar Equipo y Usuario"
                  : "Verifica el comprobante primero"}
              </button>
            </div>

            <p className="text-center text-base text-gray-700">
              ¿Ya tienes cuenta?{" "}
              <a className="text-primary hover:underline" href="/login">
                Inicia sesión aquí
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
