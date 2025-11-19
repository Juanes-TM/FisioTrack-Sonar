export default function Toast({ msg }) {
  return (
    <div className="
      fixed bottom-6 right-6 
      bg-teal-600 text-white 
      px-4 py-3 rounded-xl shadow-lg 
      text-sm font-medium
      animate-slideIn
      z-50
    ">
      {msg}
    </div>
  );
}
