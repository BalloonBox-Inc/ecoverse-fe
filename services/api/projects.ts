import projectList from '../../sample-data/projects.json';

// todo: need to get schema from Mayllon
interface Project {
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

export type QueriedProjects = (Project & ProjectFilter)[];

export const getProjects = (): Promise<QueriedProjects> => {
  return new Promise((resolve) => {
    const projects = projectList.map((project) => ({
      ...project,
      resource: project.productGroup,
      size: project.effectiveArea,
    }));

    resolve(projects);
  });
};

export const getProjectByFarmId = (
  farmId: string
): Promise<QueriedProjects[0]> => {
  return new Promise((resolve, reject) => {
    const project = projectList.find((project) => project.farmId === farmId);

    if (!project) {
      reject('Nothing found');
    } else {
      const projectToReturn = {
        ...project,
        resource: project.productGroup,
        size: project.effectiveArea,
      };
      resolve(projectToReturn);
    }
  });
};
