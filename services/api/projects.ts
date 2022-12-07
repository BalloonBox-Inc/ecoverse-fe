import projectList from '../../sample-data/projects.json';

// todo: need to get schema from Mayllon
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

export interface FilterParams {
  country?: string;
  resource?: string;
  status?: string;
  minSize?: number;
  maxSize?: number;
  certifiedFSC?: boolean;
}

interface ProjectSummary {
  country: string;
  resource: string;
  status: string;
  size: number;
  certifiedFSC: boolean;
}

export type QueriedProjects = (Project & ProjectSummary)[];

const checkFilter = (
  project: ProjectSummary,
  filterParams: FilterParams
): boolean => {
  let filter: keyof FilterParams;
  for (filter in filterParams) {
    if (typeof filterParams[filter] !== 'number') {
      if (project[filter as keyof ProjectSummary] !== filterParams[filter])
        return false;
    }
  }

  const minSize = filterParams.minSize ?? Number.NEGATIVE_INFINITY;
  const maxSize = filterParams.maxSize ?? Number.POSITIVE_INFINITY;

  if (project.size < minSize) return false;
  if (project.size > maxSize) return false;

  return true;
};

export const getProjects = (
  filterParams?: FilterParams
): Promise<QueriedProjects> => {
  return new Promise((resolve) => {
    const projects = projectList.map((project) => ({
      ...project,
      resource: project.productGroup,
      size: project.effectiveArea,
    }));

    if (!filterParams) {
      resolve(projects);
    } else {
      resolve(projects.filter((project) => checkFilter(project, filterParams)));
    }
  });
};
