import { TaxClient } from "./TaxClient";
import { getUserTaxProfile } from "@/app/actions/tax";

export default async function TaxPage() {
  const profile = await getUserTaxProfile();

  return <TaxClient initialProfile={profile} />;
}
