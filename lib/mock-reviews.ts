type MockReviewInput = {
  name: string;
  category: string;
  rating: number;
};

const positiveTemplates = (name: string, category: string) => [
  `Really enjoyed my visit to ${name}! The ${category} experience was top-notch — friendly staff, great atmosphere, and everything felt well taken care of. Would definitely come back again.`,
  `${name} exceeded my expectations. Quick service, quality offerings, and a welcoming vibe throughout. One of the better ${category} spots I've tried recently.`,
  `Had a wonderful time at ${name}. Everything from start to finish was smooth and satisfying. Highly recommend giving them a try if you're in the area.`,
];

const mixedTemplates = (name: string, category: string) => [
  `${name} was okay overall. Some things were good, but a couple of details could be better. Decent ${category} option if you're nearby.`,
  `My experience at ${name} was average — nothing bad, but nothing that really stood out either. Might give them another shot.`,
  `Visited ${name} recently. Service was fine and the place was clean, though I was hoping for a bit more. Room for improvement.`,
];

const negativeTemplates = (name: string, category: string) => [
  `Disappointed with my visit to ${name}. Expected better for a ${category} in this area. Several things didn't meet expectations.`,
  `Unfortunately ${name} fell short today. Slow service and the overall experience wasn't great. Hope they can improve.`,
  `Not the best experience at ${name}. A few issues during my visit made it hard to recommend. Maybe it was an off day.`,
];

export function generateMockReviews(input: MockReviewInput): string[] {
  const { name, category, rating } = input;

  if (rating >= 4) {
    return positiveTemplates(name, category);
  }

  if (rating === 3) {
    return mixedTemplates(name, category);
  }

  return negativeTemplates(name, category);
}

export function shouldUseMockReviews(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  if (process.env.USE_MOCK_REVIEWS === "true") {
    return true;
  }

  const isLocal =
    process.env.NEXT_PUBLIC_APP_URL?.includes("localhost") ?? false;

  return isLocal && !process.env.OPENAI_API_KEY?.startsWith("sk-");
}
