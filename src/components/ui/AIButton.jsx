import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import Spinner from "../spinner";

export default function AIButton({
  title,
  onClick,
  className,
  disabled,
  size,
  path,
  isLoading
}) {
  return (
    <Button
      type="button"
      size={size}
      onClick={onClick}
      className={cn(
        "gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center",
        className,
        size
      )}
      disabled={disabled}
      asChild={path ? true : false}
    >
      {path ? (
        <Link className="w-min" href={path}>
          <Sparkles className="h-5 w-5" /> {title}
        </Link>
      ) : (
        <>
          {isLoading ? <Spinner /> : <div className="flex gap-2 items-center"><Sparkles className="h-5 w-5" /> {title || "Generate By ScholarPASS Copilot"}</div>}
        </>
      )}
    </Button>
  );
}
