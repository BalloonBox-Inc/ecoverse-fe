import axios from '@plugins/axios';
import { getCenterFromLngLat } from '@utils/map-utils';
import { LngLat, LngLatBounds } from 'mapbox-gl';

export interface Project {
  farmId: string;
  groupScheme: string;
  country: string;
  province: string;
  latitude: number;
  longitude: number;
  isFscCertified: boolean;
  hectareUsd: number;
  farmSize: number;
  farmRadius: number;
  effectiveArea: number;
  treesPlanted: number;
  plantAge: number;
  farmCo2y: number;
  productGroup: string[];
  scientificName: string[];
  status: string;
  polygon: string;
}

export interface ProjectFilter {
  resource: string;
  size: number;
  certifiedFSC: boolean;
}

export type QueriedProject = Project & ProjectFilter;

export type QueriedProjectSummaryWithTiles = {
  data: QueriedProject;
  tiles: string[];
};

enum URL {
  allProjects = '/farms',
  allProjectsByBounds = '/farms/bounds',
  getProjectsByQuery = '/farms/search',
}

export type Center = LngLat;
export interface Place {
  id: string;
  place: string;
  center: Center;
}

export const getProjects = async (): Promise<QueriedProject[]> => {
  const projects: Project[] = (
    await axios({
      method: 'GET',
      url: URL.allProjects,
    })
  ).data;

  return projects.map((project: Project) => ({
    ...project,
    resource: project.productGroup.join(', '),
    size: project.effectiveArea,
    certifiedFSC: project.isFscCertified,
  }));
};

export const getProjectsByBounds = async (
  bounds: LngLatBounds | null,
  isMarker: boolean = true
): Promise<QueriedProject[] | QueriedProjectSummaryWithTiles[]> => {
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
      url: `${URL.allProjectsByBounds}?${boundsQuery}&isMarker=${isMarker}`,
    })
  ).data;
};

export const getProjectByFarmId = async (
  farmId: string
): Promise<QueriedProject> => {
  const project: Project = (
    await axios({
      method: 'GET',
      url: `${URL.allProjects}/${farmId}`,
    })
  ).data;

  return {
    ...project,
    resource: project.productGroup.join(', '),
    size: project.effectiveArea,
    certifiedFSC: project.isFscCertified,
  };
};

export const getPlaces = async (query: string): Promise<Place[]> => {
  const projects = (
    await axios({
      method: 'GET',
      url: `${URL.getProjectsByQuery}?query=${query}`,
    })
  ).data;

  return projects
    .sort((projectA: Partial<Project>, projectB: Partial<Project>) => {
      return projectB.effectiveArea! - projectA.effectiveArea!;
    })
    .map((project: Partial<Project>) => ({
      id: project.farmId,
      place: `${project.province}, ${project.country}: ${project.effectiveArea} ha`,
      center: getCenterFromLngLat(project.longitude!, project.latitude!),
    }))
    .slice(0, 5);
};
