export default function DashboardCard({ label, color }) {
  return (
    <div className="flex flex-col items-center justify-center border rounded-lg shadow p-4 bg-white hover:shadow-md transition">
      <div className={`w-10 h-10 rounded-full ${color}`}></div>
      <p className="mt-2 text-gray-700 font-medium">{label}</p>
      <p className="text-xl font-bold text-gray-900">0</p>
    </div>
  );
}
