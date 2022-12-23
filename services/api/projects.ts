import axios from '@plugins/axios';
import { LngLatBounds } from 'mapbox-gl';

export interface Project {
  farmId: string;
  groupScheme: string;
  productGroup: string;
  genusName: string;
  speciesName: string;
  province: string;
  latitude: number;
  longitude: number;
  farmSize: number;
  farmRadius: number;
  unitNumber: number;
  effectiveArea: number;
  sphaSurvival: number;
  plantAge: number;
  carbonSequesteredPerYear: number;
  carbonSequesteredPerDay: number;
  country: string;
  status: string;
  certifiedFSC: boolean;
}

export interface ProjectFilter {
  country: string;
  resource: string;
  status: string;
  size: number;
  certifiedFSC: boolean;
}

export type QueriedProject = Project & ProjectFilter;

export type QueriedProjectSummary = Partial<Project> & ProjectFilter;

export type QueriedProjectSummaryWithTiles = QueriedProjectSummary & {
  tiles: string[];
};

enum URL {
  allProjects = '/farms',
  allProjectsByBounds = '/farms/bounds',
}

export const getProjects = async (): Promise<QueriedProjectSummary[]> => {
  const projects = (
    await axios({
      method: 'GET',
      url: URL.allProjects,
    })
  ).data;

  return projects.map((project: Partial<Project>) => ({
    ...project,
    resource: project.productGroup,
    size: project.effectiveArea,
  }));
};

export const getProjectsByBounds = async (
  bounds: LngLatBounds | null
): Promise<QueriedProjectSummaryWithTiles[]> => {
  if (!bounds) return [];
  const boundsList = [
    ['n', bounds.getNorth()],
    ['s', bounds.getSouth()],
    ['e', bounds.getEast()],
    ['w', bounds.getWest()],
  ];

  const boundsQuery = boundsList
    .map((direction) => direction.join('='))
    .join('&');

  return (
    await axios({
      method: 'GET',
      url: `${URL.allProjectsByBounds}?${boundsQuery}`,
    })
  ).data;
};

export const getProjectByFarmId = async (farmId: string): Promise<Project> => {
  const project = (
    await axios({
      method: 'GET',
      url: `${URL.allProjects}/${farmId}`,
    })
  ).data;

  return {
    ...project,
    resource: project.productGroup,
    size: project.effectiveArea,
  };
};
