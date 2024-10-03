import { cn } from "@/lib/utils";

export default function FarmerDetect({ status, title, icon, className }) {
  return (
    <div className="flex flex-col items-center justify-center min-w-0 min-h-0 gap-4 p-4 grow">
      <img src={icon} alt={title} className="w-16 h-16 rounded-full" />
      <h3 className="font-bold text-center">
        {status === "pending-webapp" ? "Getting App" : "Fetching Auth"}
      </h3>
      <p className={cn("text-center text-neutral-500", className)}>
        {status === "pending-webapp"
          ? "Please open/reload the bot"
          : "Loading..."}
      </p>
    </div>
  );
}
