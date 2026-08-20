// TASK-201: Product Understanding Engine — 테스트 Product 1개로 결과 확인
//
//   pnpm ai:test-product                     # seed 목록의 첫 번째 제품으로 테스트
//   pnpm ai:test-product MWTGABO01MT001      # product_code 지정
//
// OPENAI_API_KEY가 .env.local 또는 환경변수에 있어야 실제 호출이 수행된다.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
// @ts-expect-error TS5097: 플레인 node로 직접 실행하기 위해 명시적 .ts 확장자를 유지한다
// (moduleResolution: "bundler"에서는 allowImportingTsExtensions 없이 tsc가 이를 거부하지만,
// 런타임 동작에는 영향이 없다).
import { analyzeProduct } from "../src/lib/ai/product-understanding.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadDotEnv(file: string) {
  const filePath = path.join(ROOT, file);
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}
loadDotEnv(".env.local");
loadDotEnv(".env");

interface SourceProduct {
  product_id: string;
  product_name: string;
  color_name: string | null;
  description: string;
  material: string;
  category: string;
  image_url: string;
}

async function main() {
  const products: SourceProduct[] = JSON.parse(
    readFileSync(path.join(ROOT, "seed", "mcm_seed_source_30.json"), "utf8")
  );

  const requestedCode = process.argv[2];
  const product = requestedCode
    ? products.find((p) => p.product_id === requestedCode)
    : products[0];

  if (!product) {
    console.error(`테스트할 제품을 찾을 수 없습니다: ${requestedCode ?? "(첫 번째 제품)"}`);
    process.exit(1);
  }

  console.log("== TASK-201 Product Understanding Engine 테스트 ==");
  console.log(`대상 제품: ${product.product_id} (${product.product_name})`);
  console.log(`이미지: ${product.image_url}`);
  console.log("");

  const result = await analyzeProduct({
    imageUrl: product.image_url,
    officialDescription: product.description,
    metadata: {
      category: product.category,
      officialColor: product.color_name,
    },
  });

  console.log("Product Profile 생성 완료:");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error("테스트 실패:", err instanceof Error ? err.message : err);
  process.exit(1);
});
