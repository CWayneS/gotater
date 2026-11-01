/*
  TaterOS app manifest — the only file to edit when adding an app.

  To add an app:
    1. Put it at apps/<id>/index.html
    2. Add an entry below

  Fields:
    id        folder name under apps/ (also used in URLs: /#open=<id>)
    title     shown under the icon and in the title bar
    blurb     one-liner shown in folder views and search
    category  games | learn | tools | toys
    icon      an emoji
    color     icon tile color
    w, h      default window size (optional)
    max       open maximized (optional)
    added     YYYY-MM-DD, newest 3 show up in the "New!" folder
*/
export default [
  // games
  { id: 'gotater', title: 'Go Tater', blurb: 'Make it to the endless round', category: 'games', icon: '🥔', color: '#c8893b', max: true, added: '2025-01-01' },
  { id: 'swindler', title: 'Swindler', blurb: 'Dungeon crawl solitaire', category: 'games', icon: '🃏', color: '#7a3b5c', w: 900, h: 680, added: '2025-01-01' },
  { id: 'meteor-defender', title: 'Meteor Defender', blurb: 'Protect your city from falling rocks', category: 'games', icon: '☄️', color: '#3a4a8a', w: 900, h: 680, added: '2025-01-01' },
  { id: 'glyphcrawl', title: 'Glyphcrawl', blurb: 'Emojis with swords clearing dungeons', category: 'games', icon: '🗡️', color: '#2f5f4a', w: 900, h: 700, added: '2025-01-01' },
  { id: 'out-driving', title: 'Out Driving', blurb: 'High-speed driving action. Sort of', category: 'games', icon: '🏎️', color: '#a83a2a', max: true, added: '2026-10-22' },
  { id: 'sokoban-studio', title: 'Sokoban Studio', blurb: 'Push boxes, build levels', category: 'games', icon: '📦', color: '#8a6a2f', w: 1000, h: 700, added: '2026-10-11' },
  { id: 'typo-kart', title: 'Typo Kart', blurb: 'Type by driving a tiny car onto each key', category: 'games', icon: '🚗', color: '#a8402a', w: 1000, h: 680, added: '2026-10-21' },
  { id: 'tatersweeper', title: 'Tatersweeper', blurb: 'Find the potatoes. Do not dig them up', category: 'games', icon: '🚩', color: '#5a7a3a', w: 560, h: 640, added: '2026-10-22' },
  { id: 'zork', title: 'Zork', blurb: 'The Great Underground Empire, I through III', category: 'games', icon: '🏚️', color: '#4a3a22', w: 900, h: 640, added: '2026-10-31' },
  { id: 'micropolis', title: 'Micropolis', blurb: 'Be mayor. The original open-source city sim', category: 'games', icon: '🏙️', color: '#2a5a8a', max: true, added: '2026-11-01' },

  // learn
  { id: 'math-vocab', title: 'Basic Math Vocab', blurb: 'Chill drag and drop vocabulary', category: 'learn', icon: '➗', color: '#3b7a8a', w: 900, h: 680, added: '2025-01-01' },
  { id: 'luau-lab', title: 'Luau Lab', blurb: 'Interactive Luau programming course', category: 'learn', icon: '🧪', color: '#2a5fa8', max: true, added: '2025-01-01' },
  { id: 'block-to-luau', title: 'Block to Luau', blurb: 'Drag-and-drop coding', category: 'learn', icon: '🧱', color: '#a8582a', max: true, added: '2025-01-01' },
  { id: 'git-playground', title: 'Git Playground', blurb: 'See git happen', category: 'learn', icon: '🌳', color: '#3a7a3a', w: 1100, h: 720, added: '2025-01-01' },
  { id: 'github-branching-guide', title: 'GitHub Branching Guide', blurb: 'Learn git branching workflows', category: 'learn', icon: '🌿', color: '#4a6a3a', w: 960, h: 720, added: '2025-01-01' },

  // tools
  { id: 'recipe-studio', title: 'Recipe Studio', blurb: 'Make your recipes look nice', category: 'tools', icon: '🍳', color: '#b8743a', max: true, added: '2025-01-01' },
  { id: 'grit-paint', title: 'Grit Paint', blurb: 'Make pixel art gifs', category: 'tools', icon: '🎨', color: '#8a3a8a', max: true, added: '2025-01-01' },
  { id: 'workshop', title: 'The Workshop', blurb: 'Woodworking calculators', category: 'tools', icon: '🪚', color: '#7a5a3a', w: 960, h: 720, added: '2025-01-01' },
  { id: 'voidwave', title: 'Voidwave', blurb: 'Music player with visualizations', category: 'tools', icon: '🎵', color: '#3a2a6a', w: 1000, h: 680, added: '2025-01-01' },
  { id: 'crop-studio', title: 'Crop Studio', blurb: 'Image crop tool', category: 'tools', icon: '✂️', color: '#4a5a6a', w: 1000, h: 700, added: '2025-01-01' },
  { id: 'git-guide', title: 'Git Guide', blurb: 'Step-by-step git because I forget', category: 'tools', icon: '📜', color: '#5a4a3a', w: 900, h: 700, added: '2025-01-01' },
  { id: 'menucraft', title: 'MenuCraft', blurb: 'Build beautiful restaurant menus', category: 'tools', icon: '🍽️', color: '#6a3a3a', max: true, added: '2025-01-01' },
  { id: 'i-was-framed', title: 'I Was Framed', blurb: 'Basic wireframes tool', category: 'tools', icon: '🖼️', color: '#3a5a7a', max: true, added: '2025-01-01' },
  { id: 'signull', title: 'Signull', blurb: 'Tech news monitor', category: 'tools', icon: '📡', color: '#5a6a4a', w: 1100, h: 740, added: '2026-10-11' },

  // toys
  { id: 'lagoon', title: 'Lagoon', blurb: 'A quiet lagoon to poke at', category: 'toys', icon: '🌊', color: '#2a7a8a', w: 900, h: 680, added: '2026-10-11' },
  { id: 'stillwater', title: 'Stillwater', blurb: 'A pond garden through the seasons', category: 'toys', icon: '🪷', color: '#3a6a5a', w: 900, h: 680, added: '2026-10-11' },
  { id: 'defrag', title: 'Disk Defragmenter', blurb: 'Watch the little blocks get tidy', category: 'toys', icon: '💽', color: '#2a4a8a', w: 820, h: 600, added: '2026-10-21' },
];

export const categories = {
  games: { title: 'Games', icon: '🕹️' },
  learn: { title: 'Learn', icon: '📚' },
  tools: { title: 'Tools', icon: '🧰' },
  toys:  { title: 'Toys',  icon: '🫧' },
};
