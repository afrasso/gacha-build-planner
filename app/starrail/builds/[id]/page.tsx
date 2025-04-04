import BuildDetails from "@/components/builds/BuildDetails";

export default function BuildDetailsPage({ params }: { params: { id: string } }) {
  return (
    <main className="p-8">
      <BuildDetails characterId={params.id} />
    </main>
  );
}
