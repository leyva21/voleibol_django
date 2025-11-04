import { useState, useEffect } from "react";
import { Filter, List, Search, Download } from "lucide-react";
import { fetchEquipos } from "../api/equipos";

export default function Equipos() {
  const [search, setSearch] = useState("");
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEquipos() {
      try {
        setLoading(true);
        const data = await fetchEquipos({ search });
        setEquipos(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadEquipos();
  }, [search]);

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Equipos</h1>
        <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition">
          <Download size={18} />
          Exportar
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-lg shadow">
        <h2 className="bg-gray-100 border-b px-4 py-2 flex items-center gap-2 text-gray-700 font-semibold">
          <Filter size={18} /> Filtros
        </h2>

        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Estado</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>Todos</option>
              <option>Validados</option>
              <option>Pendientes</option>
            </select>
          </div>

          {/* Rama */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Rama</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>Todas</option>
              <option>Varonil</option>
              <option>Femenil</option>
            </select>
          </div>

          {/* Liga/Torneo */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Liga/Torneo</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>Todas</option>
              <option>Liga Municipal de Voleibol OMA</option>
            </select>
          </div>

          {/* Buscar */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Buscar</label>
            <div className="flex">
              <input
                type="text"
                placeholder="Nombre o delegado"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-r-md transition">
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de equipos */}
      <div className="bg-white border border-gray-200 rounded-lg shadow">
        <h2 className="bg-gray-100 border-b px-4 py-2 flex items-center gap-2 text-gray-700 font-semibold">
          <List size={18} /> Lista de Equipos
        </h2>

        <div className="p-4 overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-500 py-6">Cargando equipos...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-6">{error}</p>
          ) : equipos.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              No hay datos disponibles en la tabla
            </p>
          ) : (
            <table className="w-full text-sm text-left border-t border-gray-200">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  {["Equipo", "Liga", "Delegado", "Contacto", "Rama", "Estado", "Registro", "Acciones"].map(
                    (header) => (
                      <th key={header} className="px-4 py-2 font-semibold border-b border-gray-200">
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {equipos.map((e) => (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{e.nombre}</td>
                    <td className="px-4 py-2">{e.liga}</td>
                    <td className="px-4 py-2">{e.delegado}</td>
                    <td className="px-4 py-2">{e.contacto}</td>
                    <td className="px-4 py-2">{e.rama}</td>
                    <td className="px-4 py-2">{e.estado}</td>
                    <td className="px-4 py-2">{e.registro}</td>
                    <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">Ver</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
