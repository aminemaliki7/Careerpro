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

export function getAllRoadmaps(): Roadmap[] {
  try {
    const filenames = getRoadmapFiles();
    if (filenames.length === 0) {
      console.warn('No roadmap JSON files found in:', roadmapsDirectory); // Debug: Warn if no files
    }
    const roadmaps = filenames.map(filename => {
      const filePath = path.join(roadmapsDirectory, filename);
      try {
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        console.log(`Successfully read file: ${filename}`); // Debug: Confirm file read
        return JSON.parse(fileContents) as Roadmap;
      } catch (error) {
        console.error(`Error parsing JSON file ${filename}:`, error);
        return null;
      }
    }).filter((roadmap): roadmap is Roadmap => roadmap !== null); // Remove null entries
    // Sort the roadmaps alphabetically by title
    roadmaps.sort((a, b) => a.title.localeCompare(b.title));
    console.log('Roadmaps loaded:', roadmaps.map(r => r.id)); // Debug: Log loaded roadmap IDs
    return roadmaps;
  } catch (error) {
    console.error('Error in getAllRoadmaps:', error);
    return [];
  }
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