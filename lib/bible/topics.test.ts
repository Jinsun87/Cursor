import { describe, it, expect } from "vitest";
import {
  BIBLE_TOPICS,
  TOPIC_CATEGORIES,
  getHomilyForChapter,
} from "./topics";

describe("Bible Topics & Life Situations Catalog", () => {
  it("contains all 4 required categories with appropriate icons", () => {
    expect(TOPIC_CATEGORIES.length).toBe(4);
    const categoryIds = TOPIC_CATEGORIES.map((c) => c.id);
    expect(categoryIds).toEqual(["struggles", "growth", "emotions", "philosophical"]);

    for (const cat of TOPIC_CATEGORIES) {
      expect(cat.label).toBeTruthy();
      expect(cat.icon).toBeTruthy();
    }
  });

  it("contains all 48 user-requested topics across the 4 categories", () => {
    expect(BIBLE_TOPICS.length).toBe(48);

    const struggles = BIBLE_TOPICS.filter((t) => t.category === "struggles");
    const growth = BIBLE_TOPICS.filter((t) => t.category === "growth");
    const emotions = BIBLE_TOPICS.filter((t) => t.category === "emotions");
    const philosophical = BIBLE_TOPICS.filter((t) => t.category === "philosophical");

    expect(struggles.length).toBe(14);
    expect(growth.length).toBe(12);
    expect(emotions.length).toBe(17);
    expect(philosophical.length).toBe(5);

    // Verify key topics in each group
    const topicIds = BIBLE_TOPICS.map((t) => t.id);

    // Challenges & Inner Struggles
    const expectedStruggles = [
      "anxiety", "guilt", "regret", "jealousy", "anger", "ego",
      "doubt", "failure", "confusion", "attachment", "greed",
      "grief", "comparison", "desire"
    ];
    for (const id of expectedStruggles) {
      expect(topicIds).toContain(id);
    }

    // Self-Growth & Strength
    const expectedGrowth = [
      "determination", "discipline", "purpose", "self-control",
      "responsibility", "integrity", "self-awareness", "motivation",
      "sacrifice", "self-care", "leadership", "balance"
    ];
    for (const id of expectedGrowth) {
      expect(topicIds).toContain(id);
    }

    // Core Human Emotions & Spiritual Insights
    const expectedEmotions = [
      "love", "trust", "fear", "courage", "wisdom", "faith", "hope",
      "peace", "compassion", "forgiveness", "patience", "gratitude",
      "humility", "unity", "respect", "harmony", "understanding"
    ];
    for (const id of expectedEmotions) {
      expect(topicIds).toContain(id);
    }

    // Philosophical & Spiritual Concepts
    const expectedPhilosophical = [
      "righteousness", "detachment", "enlightenment", "acceptance", "freedom"
    ];
    for (const id of expectedPhilosophical) {
      expect(topicIds).toContain(id);
    }
  });

  it("ensures each topic has valid sub-sections, scriptures, and homilies", () => {
    let totalSubSections = 0;

    for (const topic of BIBLE_TOPICS) {
      expect(topic.id).toBeTruthy();
      expect(topic.label).toBeTruthy();
      expect(topic.icon).toBeTruthy();
      expect(topic.summary).toBeTruthy();
      expect(topic.categoryLabel).toBeTruthy();
      expect(topic.subSections.length).toBeGreaterThanOrEqual(3);

      for (const sub of topic.subSections) {
        totalSubSections++;
        expect(sub.id).toBeTruthy();
        expect(sub.title).toBeTruthy();
        expect(sub.tag).toBeTruthy();

        // Scripture Verse Check
        expect(sub.verse.reference).toBeTruthy();
        expect(sub.verse.bookSlug).toBeTruthy();
        expect(sub.verse.chapterNumber).toBeGreaterThan(0);
        expect(sub.verse.verseSnippet).toBeTruthy();
        expect(sub.verse.thematicTakeaway).toBeTruthy();

        // Church Father Homily Check
        expect(sub.homily.title).toBeTruthy();
        expect(sub.homily.preacher).toBeTruthy();
        expect(sub.homily.duration).toBeTruthy();
        expect(sub.homily.practicalTips.length).toBeGreaterThanOrEqual(2);
        expect(sub.homily.audioScript.length).toBeGreaterThan(50);
      }
    }

    // Total sub-situations across the entire library
    expect(totalSubSections).toBeGreaterThanOrEqual(180);
  });

  it("resolves default homily for chapters via getHomilyForChapter", () => {
    const result = getHomilyForChapter("philippians", 4);
    expect(result).toBeDefined();
    expect(result.homily.title).toBeTruthy();
    expect(result.homily.preacher).toBeTruthy();
    expect(result.homily.practicalTips.length).toBeGreaterThan(0);
    expect(result.scriptureReference).toBeTruthy();
  });
});
