import AuthButton from "@/components/AuthButton";
import BuildManagerServerWrapper from "@/components/BuildManagerServerWrapper";

export default function Home() {
  return (
    <main className="min-h-screen p-24">
      <AuthButton />
      <BuildManagerServerWrapper />
    </main>
  );
}
