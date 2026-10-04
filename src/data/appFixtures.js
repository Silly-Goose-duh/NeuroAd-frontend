export const sampleCampaigns = [
  { id: 'weekend-offer', name: 'Weekend Offer', platform: 'Facebook · Conversion', format: 'Text', detail: '86 words', score: null, status: 'Processing', nextStep: 'Analyzing message clarity', date: 'Today, 10:30', resultType: 'text' },
  { id: 'monsoon-drop', name: 'Monsoon Drop', platform: 'Instagram · Brand awareness', format: 'Video', detail: '15 sec', score: 82, status: 'Ready', nextStep: 'Review 3 attention drops', date: 'Today, 10:24', resultType: 'video' },
  { id: 'festive-reel', name: 'Festive Reel', platform: 'YouTube · Purchase', format: 'Video', detail: '30 sec', score: 74, status: 'Ready', nextStep: 'Review 2 attention drops', date: 'Today, 09:48', resultType: 'video' },
  { id: 'launch-still', name: 'Launch Still', platform: 'Facebook · Traffic', format: 'Image', detail: '1080 × 1080', score: 69, status: 'Ready', nextStep: 'Improve CTA visibility', date: 'Yesterday, 16:32', resultType: 'image' },
  { id: 'founder-cut', name: 'Founder Cut', platform: 'Instagram · Consideration', format: 'Video', detail: '24 sec', score: 77, status: 'Ready', nextStep: 'Review 1 attention drop', date: 'Yesterday, 14:05', resultType: 'video' },
]

export const historyCampaigns = sampleCampaigns.filter((item) => item.id !== 'weekend-offer')

const commonScores = [
  ['Audience Match', 78],
  ['Emotional Impact', 84],
  ['Memory Retention', 71],
  ['Purchase Intent', 69],
  ['Trend Alignment', 74],
]

export const resultFixtures = {
  video: {
    format: 'Video', score: 82, title: 'Where attention changes', view: 'Video · Time-based view',
    campaign: 'Monsoon Drop', context: 'Instagram · Brand awareness', duration: '0:24', selected: '0:13',
    bars: [30, 38, 48, 61, 73, 87, 96, 89, 75, 59, 44, 31, 22, 36, 55, 70, 82, 90, 79, 67, 56, 47, 38, 30],
    beats: [['0:07', 'Peak'], ['0:13', 'Drop'], ['0:18', 'Return']],
    note: 'Peaks 0:07. Drops 0:13. Comes back 0:18.',
    scores: [['Attention', 82], ...commonScores],
    strengths: [
      'The opening holds attention through 0:07, and the return at 0:18 brings viewers back.',
      'The pacing feels strongest when the energy stays steady and the message stays clear.',
    ],
    improvements: [
      { title: 'Tighten the middle', note: 'Try a shorter transition or an earlier visual change around the drop.', tag: '0:13' },
      { title: 'Make the return memorable', note: 'Try pairing the returning moment with a clear brand cue.', tag: '0:18' },
      { title: 'Clarify the next step', note: 'Test one simple closing message without crowding the brand story.', tag: 'Message' },
    ],
  },
  image: {
    format: 'Image', score: 85, title: 'Where attention lands', view: 'Image · Spatial view',
    campaign: 'Monsoon Drop', context: 'Instagram · Brand awareness', duration: '1080 × 1350',
    regions: [['Product', 52, 'Strongest focal point'], ['Headline', 34, 'Clear secondary entry point'], ['Call to action', 14, 'Competes with the background']],
    scores: [['Attention', 85], ['Audience Match', 81], ['Emotional Impact', 86], ['Memory Retention', 79], ['Purchase Intent', 72], ['Trend Alignment', 79]],
    strengths: [
      'The product is the strongest focal point, drawing 52% of the sample attention.',
      'The headline follows naturally, creating a clear product-to-message hierarchy.',
      'The warm contrast helps the rainwear stand out against the muted setting.',
    ],
    improvements: [
      { title: 'Give the CTA more contrast', note: 'Try a solid background behind the next step so it stands apart from the image.', tag: 'CTA' },
      { title: 'Bring the brand closer to the product', note: 'Place a clear brand cue near the main focal point to strengthen recall.', tag: 'Brand' },
      { title: 'Simplify the supporting copy', note: 'Keep one short benefit beneath the headline to reduce visual competition.', tag: 'Copy' },
    ],
  },
  audio: {
    format: 'Audio', score: 80, title: 'Where attention changes', view: 'Audio · Time-based view',
    campaign: 'Monsoon Drop', context: 'Instagram · Brand awareness', duration: '24 seconds', selected: '0:12',
    bars: [28, 48, 69, 54, 39, 63, 78, 90, 72, 58, 36, 25, 19, 24, 33, 49, 61, 73, 84, 72, 57, 48, 37, 26, 34, 43],
    beats: [['0:05', 'Voice hook'], ['0:12', 'Drop'], ['0:17', 'Brand cue']],
    note: 'Peaks 0:05. Drops 0:12. Comes back 0:17.',
    scores: [['Attention', 80], ['Audience Match', 77], ['Emotional Impact', 85], ['Memory Retention', 74], ['Purchase Intent', 68], ['Trend Alignment', 76]],
    strengths: [
      'The opening voice hook holds attention through 0:05 before the music takes over.',
      'The brand cue at 0:17 brings listeners back and creates a distinct recall moment.',
      'The warm voice and steady rhythm support the campaign’s confident tone.',
    ],
    improvements: [
      { title: 'Tighten the instrumental break', note: 'Shorten the music-only section around the drop or bring the voice back sooner.', tag: '0:12' },
      { title: 'Let the brand cue breathe', note: 'Lower the music beneath the brand name so listeners can hear it clearly.', tag: '0:17' },
      { title: 'Make the closing action explicit', note: 'End with one spoken next step and a short pause to let it land.', tag: 'CTA' },
    ],
  },
  text: {
    format: 'Text', score: 78, title: 'Where the message connects', view: 'Text · Reading-order view',
    campaign: 'Monsoon Drop', context: 'Instagram · Brand awareness', duration: 'Instagram caption',
    copy: [
      { label: 'Hook', value: 'Rain in the forecast? Good.' },
      { label: 'Benefit', value: 'Meet Monsoon Drop. Lightweight layers that keep you dry, wherever the day takes you.' },
      { label: 'Call to action', value: 'Discover more →' },
    ],
    scores: [['Attention', 78], ['Audience Match', 69], ['Emotional Impact', 76], ['Memory Retention', 73], ['Purchase Intent', 65], ['Trend Alignment', 75]],
    note: 'Hook leads. Benefit holds. The closing action loses clarity.',
    strengths: [
      'The opening question creates curiosity and gives readers a reason to keep going.',
      'The weather-ready benefit is specific and connects naturally to Monsoon Drop.',
      'The short sentences keep the tone direct and the message easy to scan.',
    ],
    improvements: [
      { title: 'Make the next step specific', note: 'Replace “Discover more” with “Shop Monsoon Drop” so readers know what to do.', tag: 'CTA' },
      { title: 'Move the benefit forward', note: 'Lead with the lightweight, rain-ready promise before the supporting detail.', tag: 'Benefit' },
      { title: 'Strengthen the brand cue', note: 'Pair the campaign name with the main promise to make the message memorable.', tag: 'Brand' },
    ],
  },
}
