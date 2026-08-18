import {
  analyzeEventMeaning,
  EVENT_MEANING_MODEL,
} from "@/lib/ai/event-meaning-analysis";
import {
  createEventRepository,
  type EventRepository,
} from "./event.repository";
import type {
  EventMeaningAnalysis,
  EventMeaningInput,
  EventMeaningProfile,
} from "@/types/event";

type EventAnalyzer = (
  input: EventMeaningInput,
) => Promise<EventMeaningAnalysis>;

interface EventServiceDependencies {
  repository: EventRepository;
  analyzer: EventAnalyzer;
  analysisModel?: string | null;
}

export function createEventService({
  repository,
  analyzer,
  analysisModel = null,
}: EventServiceDependencies) {
  return {
    async generateMeaningProfile(eventId: string): Promise<EventMeaningProfile> {
      const event = await repository.findEventById(eventId);
      if (!event) throw new Error(`Event not found: ${eventId}`);

      const relatedProductProfiles =
        await repository.findRelatedProductProfiles(event.related_product_ids);
      const analysis = await analyzer({ event, relatedProductProfiles });

      return repository.replaceCurrentMeaningProfile({
        event_id: event.id,
        ...analysis,
        analysis_model: analysisModel,
        source: "ai_generated",
        is_current: true,
      });
    },
  };
}

export async function generateEventMeaningProfile(eventId: string) {
  const service = createEventService({
    repository: createEventRepository(),
    analyzer: analyzeEventMeaning,
    analysisModel: EVENT_MEANING_MODEL,
  });
  return service.generateMeaningProfile(eventId);
}
