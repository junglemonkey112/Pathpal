import { redirect } from "next/navigation";

// Old V1 route — redirects to V2 counsellor route
export default function ConsultantRedirect({ params }: { params: { id: string } }) {
  redirect(`/counsellor/${params.id}`);
}
