import { toast } from "sonner";

export default function preview(values) {
  return toast(JSON.stringify(values, null, 2));
}
