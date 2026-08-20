import {
  analyzeEventMeaning,
  EVENT_MEANING_MODEL,
  toEventMeaningContext,
} from "@/lib/ai/event-meaning-analysis";
import {
  createEventRepository,
  type EventRepository,
} from "./event.repository";
import {
  createProductRepository,
  type ProductProfileLookup,
} from "./product.repository";
import type {
  EventMeaningAnalysis,
  EventMeaningInput,
  EventMeaningProfile,
} from "@/types/event";
import type { EventMeaningContext } from "@/types/gatekeeper";

type EventAnalyzer = (
  input: EventMeaningInput,
) => Promise<EventMeaningAnalysis>;

interface EventServiceDependencies {
  repository: EventRepository;
  // product_profiles는 product 도메인 데이터라 EventRepository가 아니라
  // product.repository.ts의 조회 기능을 주입받는다(TASK-301 5단계 후속 리팩토링).
  findProductProfiles: ProductProfileLookup;
  analyzer: EventAnalyzer;
  analysisModel?: string | null;
}

export function createEventService({
  repository,
  findProductProfiles,
  analyzer,
  analysisModel = null,
}: EventServiceDependencies) {
  return {
    async generateMeaningProfile(eventId: string): Promise<EventMeaningProfile> {
      const event = await repository.findEventById(eventId);
      if (!event) throw new Error(`Event not found: ${eventId}`);

      const relatedProductProfiles = await findProductProfiles(
        event.related_product_ids,
      );
      const analysis = await analyzer({ event, relatedProductProfiles });

      return repository.replaceCurrentMeaningProfile({
        event_id: event.id,
        ...analysis,
        analysis_model: analysisModel,
        source: "ai_generated",
        is_current: true,
      });
    },

    // TASK-301 DB 연결 5단계: TASK-203 결과를 TASK-204 입력 형태(EventMeaningContext)로
    // 가져온다. 새 AI 판단이나 저장은 하지 않는다 — 이미 저장된 현재 프로필을 읽어 투영만 한다.
    async getCurrentMeaningContext(
      eventId: string,
    ): Promise<EventMeaningContext | null> {
      const profile = await repository.findCurrentMeaningProfile(eventId);
      if (!profile) return null;
      return toEventMeaningContext(profile);
    },
  };
}

export async function generateEventMeaningProfile(eventId: string) {
  const service = createEventService({
    repository: createEventRepository(),
    findProductProfiles: createProductRepository().findByProductIds,
    analyzer: analyzeEventMeaning,
    analysisModel: EVENT_MEANING_MODEL,
  });
  return service.generateMeaningProfile(eventId);
}

export async function getCurrentEventMeaningContext(eventId: string) {
  const service = createEventService({
    repository: createEventRepository(),
    findProductProfiles: createProductRepository().findByProductIds,
    analyzer: analyzeEventMeaning,
    analysisModel: EVENT_MEANING_MODEL,
  });
  return service.getCurrentMeaningContext(eventId);
}
