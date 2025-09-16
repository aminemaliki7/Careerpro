import { getAllRoadmaps } from '@/lib/roadmaps';

import RoadmapsGrid from '@/components/roadmaps/RoadmapsGrid';

export default async function RoadmapsPage() {
  const roadmaps = getAllRoadmaps();
  console.log('Roadmaps passed to RoadmapsGrid:', roadmaps.map(r => r.id)); // Debug: Log passed roadmaps
  return (
    <div className="min-h-screen bg-gray-50">
      {roadmaps.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-gray-500">Loading roadmaps or no data available...</p>
        </div>
      ) : (
        <RoadmapsGrid initialRoadmaps={roadmaps} />
      )}
    </div>
  );
}