import fs from 'fs';
import path from 'path';
import { Roadmap } from '@/types/roadmap';

const roadmapsDirectory = path.join(process.cwd(), 'src', 'content', 'roadmaps');

function getRoadmapFiles(): string[] {
  try {
    const files = fs.readdirSync(roadmapsDirectory).filter(file => file.endsWith('.json'));
    console.log('Roadmap files found:', files); // Debug: Log found files
    return files;
  } catch (error) {
    console.error('Error reading roadmap directory:', error);
    return [];
  }
}

export function getAllRoadmapEntries(): { roadmap: Roadmap; lastmod: string }[] {
  try {
    const filenames = getRoadmapFiles();
    if (filenames.length === 0) {
      console.warn('No roadmap JSON files found in:', roadmapsDirectory); // Debug: Warn if no files
    }
    const entries = filenames.map(filename => {
      const filePath = path.join(roadmapsDirectory, filename);
      try {
        const fileContents = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '');
        console.log(`Successfully read file: ${filename}`); // Debug: Confirm file read
        return {
          roadmap: JSON.parse(fileContents) as Roadmap,
          lastmod: fs.statSync(filePath).mtime.toISOString(),
        };
      } catch (error) {
        console.error(`Error parsing JSON file ${filename}:`, error);
        return null;
      }
    }).filter((entry): entry is { roadmap: Roadmap; lastmod: string } => entry !== null);
    entries.sort((a, b) => a.roadmap.title.localeCompare(b.roadmap.title));
    console.log('Roadmaps loaded:', entries.map(({ roadmap }) => roadmap.id)); // Debug: Log loaded roadmap IDs
    return entries;
  } catch (error) {
    console.error('Error in getAllRoadmaps:', error);
    return [];
  }
}

export function getAllRoadmaps(): Roadmap[] {
  return getAllRoadmapEntries().map(({ roadmap }) => roadmap);
}

export function getRoadmapById(id: string): Roadmap | undefined {
  const roadmaps = getAllRoadmaps();
  const roadmap = roadmaps.find(roadmap => roadmap.id === id);
  if (!roadmap) {
    console.warn(`Roadmap with ID ${id} not found`); // Debug: Warn if ID not found
  }
  return roadmap;
}

export function getRoadmapsByCategory(category: string): Roadmap[] {
  const roadmaps = getAllRoadmaps();
  return roadmaps.filter(roadmap => roadmap.category === category);
}

export function getCategories(): string[] {
  const roadmaps = getAllRoadmaps();
  return [...new Set(roadmaps.map(roadmap => roadmap.category))];
}

export function getLevels(): string[] {
  const roadmaps = getAllRoadmaps();
  return [...new Set(roadmaps.map(roadmap => roadmap.level))];
}

export function getDemandLevels(): string[] {
  const roadmaps = getAllRoadmaps();
  return [...new Set(roadmaps.map(roadmap => roadmap.demandLevel))];
}