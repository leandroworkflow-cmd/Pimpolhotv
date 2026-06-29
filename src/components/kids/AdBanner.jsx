export default function AdBanner({ type = "horizontal", className = "" }) {
  const sizeClasses = {
    horizontal: "w-full h-24",
    square: "w-full aspect-square max-w-[300px]",
    vertical: "w-full h-[600px] max-w-[160px]",
  };

  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-400 text-sm ${sizeClasses[type] || sizeClasses.horizontal} ${className}`}
    >
      Ad space ({type})
    </div>
  );
}
