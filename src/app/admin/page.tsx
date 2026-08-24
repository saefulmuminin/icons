import { redirect } from "next/navigation";

/** Nothing sits at the root of the panel yet, so the door is the whole of it. */
export default function AdminIndex() {
  redirect("/admin/login");
}
