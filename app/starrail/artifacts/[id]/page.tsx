import ArtifactDetails from "@/components/artifacts/ArtifactDetails";

export default function ArtifactDetailsPage({ params }: { params: { id: string } }) {
  return (
    <main className="p-8">
      <ArtifactDetails artifactId={params.id} />
    </main>
  );
}
