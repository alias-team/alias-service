import { EditorialCanvasFit } from "@/components/editorial/editorial-canvas-fit";
import { loadDemoPersonalEditorial } from "@/features/editorial/demo-editorial";

export const dynamic = "force-dynamic";

export default async function EditorialPreviewPage() {
  const { editorial } = await loadDemoPersonalEditorial();

  return <EditorialCanvasFit data={editorial} />;
}
