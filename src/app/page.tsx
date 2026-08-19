import { EditorialEmail } from "@/components/editorial/editorial-email";
import mockEditorial from "@/data/editorial/mock-editorial.json";
import { personalEditorialSchema } from "@/lib/validation/editorial.schema";

const editorialData = personalEditorialSchema.parse(mockEditorial);

export default function Home() {
  return (
    <main aria-label="Editorial email layout preview">
      <EditorialEmail data={editorialData} />
    </main>
  );
}
