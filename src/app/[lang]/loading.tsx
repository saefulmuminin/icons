import Image from "next/image";
import logo from "@/../public/iconz10-logo.png";

/** Shown while a page is being fetched, so navigation never lands on blank. */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      <Image src={logo} alt="" priority className="h-9 w-auto animate-pulse" />
      <span className="block h-px w-32 overflow-hidden bg-ink/10">
        <span className="block h-full w-1/3 animate-sweep bg-brand" />
      </span>
    </div>
  );
}
