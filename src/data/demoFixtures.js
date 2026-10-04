export const signalScores = [
  { label: 'Audience Match', value: 78 },
  { label: 'Emotional Match', value: 84 },
  { label: 'Attention', value: 82 },
  { label: 'Memory Retention', value: 71 },
  { label: 'Purchase Intent', value: 69 },
  { label: 'Trend Alignment', value: 74 },
]

export const journeyBefore = [
  ['Create', 'Make the ad'],
  ['Publish', 'The budget starts here'],
  ['Wait', 'Nothing to read yet'],
  ['Read analytics', 'The money is already gone'],
  ['Guess again', 'The next creative is a hunch'],
]

export const journeyWith = [
  ['Create', 'Upload your ad'],
  ['Analyze', 'See how it performs'],
  ['Find insights', 'Spot attention & engagement gaps'],
  ['Understand why', 'See what is working or failing'],
  ['Improve', 'Make a better version before you spend'],
]

export const demoResult = {
  name: 'Dew, in motion',
  brand: 'LUMA SKINCARE',
  platform: 'YouTube Shorts',
  objective: 'Product consideration',
  length: '00:15',
  overall: 78,
  verdict: 'Strong opening. Give the product a little more room to land.',
  metrics: [
    { label: 'Attention score', value: 82, suffix: '/100' },
    { label: 'Recall likelihood', value: 71, suffix: '%' },
    { label: 'Engagement lift', value: 24, suffix: '%' },
    { label: 'Purchase intent', value: 69, suffix: '/100' },
  ],
  attention: [24, 31, 48, 76, 89, 72, 57, 49, 43, 51, 62, 71, 84, 78, 66, 58, 44, 52, 63, 70, 48, 39, 32, 27],
  timeline: [
    { time: '0:00', title: 'Pattern interrupt', note: 'The close-up and first line stop the scroll.', level: 'high' },
    { time: '0:04', title: 'Benefit lands', note: 'The hydration promise is clear and easy to repeat.', level: 'high' },
    { time: '0:09', title: 'Attention softens', note: 'The product shot holds, but the pace eases.', level: 'watch' },
    { time: '0:12', title: 'Brand memory cue', note: 'The bottle and warm light bring viewers back.', level: 'high' },
  ],
  strengths: [
    'The close-up opening creates a clear visual hook in the first two seconds.',
    'The hydration benefit is easy to understand without pausing the video.',
    'The warm light gives the creative a consistent, memorable tone.',
  ],
  improvements: [
    { title: 'Bring the texture shot forward', note: 'Show the serum drop before the mid-roll product hold.', focus: '0:07' },
    { title: 'Let the brand cue breathe', note: 'Give the Luma name one clean beat before the closing frame.', focus: '0:12' },
    { title: 'Make the next step explicit', note: 'Add one short spoken action alongside the final product shot.', focus: 'CTA' },
  ],
}

export const dashboardCampaigns = [
  { name: 'Monsoon Drop', platform: 'Instagram / Brand awareness', score: 82, state: 'Ready to review', tone: 'amber' },
  { name: 'Festive Reel', platform: 'YouTube / Purchase', score: 74, state: 'Analysis complete', tone: 'copper' },
]
