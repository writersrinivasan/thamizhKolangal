import GuruChat from "@/components/GuruChat";

export const metadata = { title: "Kolam Guru AI · Thamizh Kolangal" };

export default async function GuruPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return <GuruChat initialQuery={sp.q ?? ""} />;
}
