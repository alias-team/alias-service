import { EditorialEmail } from "@/components/editorial/editorial-email";
import mockEditorial from "@/data/editorial/mock-editorial.json";
import { personalEditorialSchema } from "@/lib/validation/editorial.schema";

const editorial = personalEditorialSchema.parse(mockEditorial);

export default function EditorialPreviewPage() {
  return <EditorialEmail data={editorial} />;
}
