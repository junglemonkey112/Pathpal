import { redirect } from "next/navigation";

// Old V1 route — redirects to V2 counsellor route
export default async function ConsultantRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/counsellor/${id}`);
}
