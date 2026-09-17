import NotFoundImage from "@assets/image/no-data-found.png";

export default function NotFound() {
  return (
    <div className="flex h-full w-full shrink-0 flex-col items-center justify-center gap-3">
      <img
        src={NotFoundImage}
        alt="No orders found"
        className="h-60 w-auto object-contain select-none"
      />
      <p className="text-lg text-gray-500">No orders found</p>
    </div>
  );
}
