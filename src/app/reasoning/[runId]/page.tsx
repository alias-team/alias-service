import { GenerationLoadingUI } from "@/components/reasoning/generation-loading-ui";
import { landingFontVariables } from "@/components/landing/landing-fonts";

type ReasoningPageProps = {
  params: Promise<{ runId: string }>;
};

export default async function ReasoningPage({ params }: ReasoningPageProps) {
  const { runId } = await params;

  return (
    <main
      aria-label="AI Generation Loading"
      className={landingFontVariables}
    >
      <GenerationLoadingUI runId={runId} completionPath="/inbox" />
    </main>
  );
}
