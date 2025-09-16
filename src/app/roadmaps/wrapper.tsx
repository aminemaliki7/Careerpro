// src/app/roadmaps/wrapper.tsx
import { getAllRoadmaps } from '@/lib/roadmaps';
import RoadmapsPage from './page';

export default async function RoadmapsWrapper() {
  const roadmaps = await getAllRoadmaps(); // Fetch data server-side
  return <RoadmapsPage initialRoadmaps={roadmaps} />;
}