require('dotenv').config();
const { Int32 } = require('mongodb');
const { MongoManager } = require('../src/modules/db/mongo');
const { VIDEO_STATUS, VIDEO_VISIBILITIES } = require('../src/modules/db/constant');
const logger = require('../src/logger');

const NOW = new Date();

const seedRoles = [
  { name: 'Admin', isActive: true, isPublic: true, isDeleted: false, createdAt: NOW, updatedAt: NOW },
  { name: 'Editor', isActive: true, isPublic: true, isDeleted: false, createdAt: NOW, updatedAt: NOW },
  { name: 'Viewer', isActive: true, isPublic: true, isDeleted: false, createdAt: NOW, updatedAt: NOW },
];

const seedUsers = [
  {
    name: 'Alice Admin',
    email: 'alice@example.com',
    password: 'admin123',
    isActive: true,
    isDeleted: false,
    createdAt: NOW,
    updatedAt: NOW,
    avatarUrl: '/assets/images/avatars/avatar_1.jpg',
  },
  {
    name: 'Bob Editor',
    email: 'bob@example.com',
    password: 'editor123',
    isActive: true,
    isDeleted: false,
    createdAt: NOW,
    updatedAt: NOW,
    avatarUrl: '/assets/images/avatars/avatar_2.jpg',
  },
  {
    name: 'Carol Viewer',
    email: 'carol@example.com',
    password: 'viewer123',
    isActive: true,
    isDeleted: false,
    createdAt: NOW,
    updatedAt: NOW,
    avatarUrl: '/assets/images/avatars/avatar_3.jpg',
  },
  {
    name: 'David Chen',
    email: 'david@example.com',
    password: 'david123',
    isActive: true,
    isDeleted: false,
    createdAt: NOW,
    updatedAt: NOW,
    avatarUrl: '/assets/images/avatars/avatar_4.jpg',
  },
  {
    name: 'Eva Wang',
    email: 'eva@example.com',
    password: 'eva12345',
    isActive: true,
    isDeleted: false,
    createdAt: NOW,
    updatedAt: NOW,
    avatarUrl: '/assets/images/avatars/avatar_5.jpg',
  },
];

const categories = ['Education', 'Technology', 'Travel', 'Entertainment', 'Sports', 'News'];

const sampleThumb = (n) => `/assets/images/covers/cover_${n}.jpg`;

const seedVideos = [
  {
    title: 'Introduction to MERN Stack - Complete Beginner Guide',
    category: 'Technology',
    description: 'A comprehensive guide to building full-stack apps with MongoDB, Express, React and Node.js.',
    visibility: VIDEO_VISIBILITIES.PUBLIC,
    recordingDate: new Date(Date.now() - 5 * 86400000),
    publishedAt: new Date(Date.now() - 4 * 86400000),
    status: VIDEO_STATUS.PUBLISHED,
    fileName: 'sample-mern-guide.mp4',
    originalName: 'Introduction to MERN Stack.mp4',
    thumbnailUrl: sampleThumb(1),
    duration: new Int32(1820),
    viewCount: new Int32(12480),
    language: 'English',
    videoLink: 'http://localhost:4001/sample-mern-guide.m3u8',
    tags: ['MERN', 'Fullstack', 'Tutorial'],
    isDeleted: false,
    createdAt: new Date(Date.now() - 6 * 86400000),
    updatedAt: new Date(Date.now() - 3 * 86400000),
  },
  {
    title: 'Understanding HLS Video Streaming in 20 Minutes',
    category: 'Technology',
    description: 'Learn how HLS (HTTP Live Streaming) works with .m3u8 playlists and TS segments.',
    visibility: VIDEO_VISIBILITIES.PUBLIC,
    recordingDate: new Date(Date.now() - 12 * 86400000),
    publishedAt: new Date(Date.now() - 10 * 86400000),
    status: VIDEO_STATUS.PUBLISHED,
    fileName: 'sample-hls-explained.mp4',
    originalName: 'HLS Explained.mp4',
    thumbnailUrl: sampleThumb(2),
    duration: new Int32(1240),
    viewCount: new Int32(8210),
    language: 'English',
    videoLink: 'http://localhost:4001/sample-hls-explained.m3u8',
    tags: ['HLS', 'Video', 'Streaming'],
    isDeleted: false,
    createdAt: new Date(Date.now() - 13 * 86400000),
    updatedAt: new Date(Date.now() - 9 * 86400000),
  },
  {
    title: 'Tokyo Travel Vlog - 5 Days Itinerary',
    category: 'Travel',
    description: 'Join me for a 5-day adventure through Tokyo, from Shibuya to Asakusa.',
    visibility: VIDEO_VISIBILITIES.PUBLIC,
    recordingDate: new Date(Date.now() - 20 * 86400000),
    publishedAt: new Date(Date.now() - 18 * 86400000),
    status: VIDEO_STATUS.PUBLISHED,
    fileName: 'sample-tokyo-vlog.mp4',
    originalName: 'Tokyo Vlog 2026.mp4',
    thumbnailUrl: sampleThumb(3),
    duration: new Int32(2480),
    viewCount: new Int32(28450),
    language: 'English',
    videoLink: 'http://localhost:4001/sample-tokyo-vlog.m3u8',
    tags: ['Tokyo', 'Travel', 'Japan'],
    isDeleted: false,
    createdAt: new Date(Date.now() - 21 * 86400000),
    updatedAt: new Date(Date.now() - 17 * 86400000),
  },
  {
    title: 'Advanced JavaScript - ES2025 New Features Deep Dive',
    category: 'Technology',
    description: 'Records, Tuples, Pipeline Operator and more - everything new in the upcoming ECMAScript standard.',
    visibility: VIDEO_VISIBILITIES.PUBLIC,
    recordingDate: new Date(Date.now() - 30 * 86400000),
    publishedAt: new Date(Date.now() - 27 * 86400000),
    status: VIDEO_STATUS.PUBLISHED,
    fileName: 'sample-es2025.mp4',
    originalName: 'ES2025 New Features.mp4',
    thumbnailUrl: sampleThumb(4),
    duration: new Int32(2980),
    viewCount: new Int32(43100),
    language: 'English',
    videoLink: 'http://localhost:4001/sample-es2025.m3u8',
    tags: ['JavaScript', 'ES2025', 'Tutorial'],
    isDeleted: false,
    createdAt: new Date(Date.now() - 31 * 86400000),
    updatedAt: new Date(Date.now() - 25 * 86400000),
  },
  {
    title: 'NBA Finals 2026 - Top 10 Plays',
    category: 'Sports',
    description: 'The most jaw-dropping plays from the 2026 NBA Finals series.',
    visibility: VIDEO_VISIBILITIES.PUBLIC,
    recordingDate: new Date(Date.now() - 8 * 86400000),
    publishedAt: new Date(Date.now() - 6 * 86400000),
    status: VIDEO_STATUS.PUBLISHED,
    fileName: 'sample-nba-2026.mp4',
    originalName: 'NBA Finals 2026 Highlights.mp4',
    thumbnailUrl: sampleThumb(5),
    duration: new Int32(620),
    viewCount: new Int32(65210),
    language: 'English',
    videoLink: 'http://localhost:4001/sample-nba-2026.m3u8',
    tags: ['NBA', 'Basketball', 'Highlights'],
    isDeleted: false,
    createdAt: new Date(Date.now() - 9 * 86400000),
    updatedAt: new Date(Date.now() - 5 * 86400000),
  },
  {
    title: 'Breaking News: Tech Industry Q3 Report',
    category: 'News',
    description: 'In-depth analysis of the major moves, acquisitions and earnings from the tech sector.',
    visibility: VIDEO_VISIBILITIES.PUBLIC,
    recordingDate: new Date(Date.now() - 2 * 86400000),
    publishedAt: new Date(Date.now() - 1 * 86400000),
    status: VIDEO_STATUS.PUBLISHED,
    fileName: 'sample-tech-news-q3.mp4',
    originalName: 'Tech Q3 Report.mp4',
    thumbnailUrl: sampleThumb(3),
    duration: new Int32(940),
    viewCount: new Int32(5280),
    language: 'English',
    videoLink: 'http://localhost:4001/sample-tech-news-q3.m3u8',
    tags: ['News', 'Tech', 'Business'],
    isDeleted: false,
    createdAt: new Date(Date.now() - 3 * 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    title: 'Morning Meditation - 15 Minutes to Start Your Day',
    category: 'Entertainment',
    description: 'Relax and prepare your mind for the day ahead with a calm guided meditation.',
    visibility: VIDEO_VISIBILITIES.PUBLIC,
    recordingDate: new Date(Date.now() - 45 * 86400000),
    publishedAt: new Date(Date.now() - 43 * 86400000),
    status: VIDEO_STATUS.PUBLISHED,
    fileName: 'sample-meditation.mp4',
    originalName: 'Morning Meditation.mp4',
    thumbnailUrl: sampleThumb(1),
    duration: new Int32(920),
    viewCount: new Int32(15420),
    language: 'English',
    videoLink: 'http://localhost:4001/sample-meditation.m3u8',
    tags: ['Wellness', 'Meditation', 'Relaxing'],
    isDeleted: false,
    createdAt: new Date(Date.now() - 46 * 86400000),
    updatedAt: new Date(Date.now() - 42 * 86400000),
  },
  {
    title: 'Mastering MongoDB Aggregations',
    category: 'Education',
    description: 'From $match to $lookup, learn to build pipelines like a pro with practical examples.',
    visibility: VIDEO_VISIBILITIES.PUBLIC,
    recordingDate: new Date(Date.now() - 55 * 86400000),
    publishedAt: new Date(Date.now() - 52 * 86400000),
    status: VIDEO_STATUS.PUBLISHED,
    fileName: 'sample-mongo-agg.mp4',
    originalName: 'MongoDB Aggregations Masterclass.mp4',
    thumbnailUrl: sampleThumb(4),
    duration: new Int32(3560),
    viewCount: new Int32(33180),
    language: 'English',
    videoLink: 'http://localhost:4001/sample-mongo-agg.m3u8',
    tags: ['MongoDB', 'Database', 'Tutorial'],
    isDeleted: false,
    createdAt: new Date(Date.now() - 56 * 86400000),
    updatedAt: new Date(Date.now() - 50 * 86400000),
  },
  {
    title: 'Behind the Scenes - A Movie Studio Tour',
    category: 'Entertainment',
    description: 'Exclusive look at how blockbuster movies are made, from set design to final cut.',
    visibility: VIDEO_VISIBILITIES.UNLISTED,
    recordingDate: new Date(Date.now() - 90 * 86400000),
    publishedAt: new Date(Date.now() - 88 * 86400000),
    status: VIDEO_STATUS.PUBLISHED,
    fileName: 'sample-studio-tour.mp4',
    originalName: 'Studio Behind the Scenes.mp4',
    thumbnailUrl: sampleThumb(2),
    duration: new Int32(1840),
    viewCount: new Int32(780),
    language: 'English',
    videoLink: 'http://localhost:4001/sample-studio-tour.m3u8',
    tags: ['Movies', 'BTS', 'Tour'],
    isDeleted: false,
    createdAt: new Date(Date.now() - 91 * 86400000),
    updatedAt: new Date(Date.now() - 87 * 86400000),
  },
  {
    title: 'Queensland Road Trip - Episode 1',
    category: 'Travel',
    description: 'The start of our epic Queensland road trip, from Brisbane northwards along the coast.',
    visibility: VIDEO_VISIBILITIES.PUBLIC,
    recordingDate: new Date(Date.now() - 120 * 86400000),
    publishedAt: new Date(Date.now() - 118 * 86400000),
    status: VIDEO_STATUS.PUBLISHED,
    fileName: 'sample-queensland-ep1.mp4',
    originalName: 'Queensland Road Trip Ep1.mp4',
    thumbnailUrl: sampleThumb(5),
    duration: new Int32(2160),
    viewCount: new Int32(11080),
    language: 'English',
    videoLink: 'http://localhost:4001/sample-queensland-ep1.m3u8',
    tags: ['Australia', 'Road Trip', 'Travel'],
    isDeleted: false,
    createdAt: new Date(Date.now() - 121 * 86400000),
    updatedAt: new Date(Date.now() - 117 * 86400000),
  },
  {
    title: 'React Performance Optimization Tips',
    category: 'Technology',
    description: '10 practical tips to make your React app blazing fast in production.',
    visibility: VIDEO_VISIBILITIES.PUBLIC,
    recordingDate: new Date(Date.now() - 15 * 86400000),
    publishedAt: new Date(Date.now() - 13 * 86400000),
    status: VIDEO_STATUS.PUBLISHED,
    fileName: 'sample-react-perf.mp4',
    originalName: 'React Performance 10 Tips.mp4',
    thumbnailUrl: sampleThumb(3),
    duration: new Int32(1640),
    viewCount: new Int32(24960),
    language: 'English',
    videoLink: 'http://localhost:4001/sample-react-perf.m3u8',
    tags: ['React', 'Performance', 'Frontend'],
    isDeleted: false,
    createdAt: new Date(Date.now() - 16 * 86400000),
    updatedAt: new Date(Date.now() - 12 * 86400000),
  },
  {
    title: 'World Cup Final Highlights',
    category: 'Sports',
    description: 'Goals, saves and drama - a recap of the thrilling final match.',
    visibility: VIDEO_VISIBILITIES.PUBLIC,
    recordingDate: new Date(Date.now() - 200 * 86400000),
    publishedAt: new Date(Date.now() - 199 * 86400000),
    status: VIDEO_STATUS.PUBLISHED,
    fileName: 'sample-worldcup-final.mp4',
    originalName: 'World Cup Final 2026 Highlights.mp4',
    thumbnailUrl: sampleThumb(1),
    duration: new Int32(830),
    viewCount: new Int32(188500),
    language: 'English',
    videoLink: 'http://localhost:4001/sample-worldcup-final.m3u8',
    tags: ['Football', 'World Cup', 'Highlights'],
    isDeleted: false,
    createdAt: new Date(Date.now() - 201 * 86400000),
    updatedAt: new Date(Date.now() - 198 * 86400000),
  },
  {
    title: 'Private Content - Draft Video',
    category: 'Education',
    description: 'A private draft video, should not appear in public searches.',
    visibility: VIDEO_VISIBILITIES.PRIVATE,
    recordingDate: new Date(Date.now() - 7 * 86400000),
    publishedAt: null,
    status: VIDEO_STATUS.PENDING,
    fileName: 'sample-draft.mp4',
    originalName: 'Private Draft.mp4',
    thumbnailUrl: sampleThumb(2),
    duration: new Int32(400),
    viewCount: new Int32(0),
    language: 'English',
    videoLink: 'http://localhost:4001/sample-draft.m3u8',
    tags: ['Draft', 'Private'],
    isDeleted: false,
    createdAt: new Date(Date.now() - 8 * 86400000),
    updatedAt: new Date(Date.now() - 7 * 86400000),
  },
];

const seed = async () => {
  await MongoManager.connect();
  const { insert: insertRole } = require('../src/modules/models/role/service');
  const { insert: insertUser } = require('../src/modules/models/user/service');
  const { insert: insertVideo } = require('../src/modules/models/video/service');

  // Roles/users exist from prior run, insert only on empty
  const roleCount = await require('../src/modules/models/role/service').count({});
  if (roleCount === 0) {
    const roleIds = [];
    for (const r of seedRoles) {
      const res = await insertRole(r);
      if (res instanceof Error) continue;
      roleIds.push(res.insertedId);
      logger.info('Role seeded', { name: r.name, id: String(res.insertedId) });
    }
    seedUsers.forEach((u, i) => { u.roleId = roleIds[i % roleIds.length]; });
  }

  const userCount = await require('../src/modules/models/user/service').count({});
  if (userCount === 0) {
    for (const u of seedUsers) {
      const res = await insertUser(u);
      if (res instanceof Error) continue;
      logger.info('User seeded', { email: u.email, id: String(res.insertedId) });
    }
  }

  for (const v of seedVideos) {
    const res = await insertVideo(v);
    if (res instanceof Error) {
      logger.error('Video insert failed', { title: v.title, message: res.message });
      continue;
    }
    logger.info('Video seeded', { title: v.title, id: String(res.insertedId) });
  }

  logger.info('SEED COMPLETED');
  process.exit(0);
};

seed().catch((err) => {
  logger.error('Seed failed', err);
  process.exit(1);
});
