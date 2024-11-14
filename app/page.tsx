import AuthButton from "@/components/AuthButton";
import BuildManagerServerWrapper from "@/components/BuildManagerServerWrapper";

export default function Home() {
  return (
    <main className="min-h-screen p-24">
      <div className="mb-8">
        <AuthButton />
      </div>
      <BuildManagerServerWrapper />
    </main>
  );
}
