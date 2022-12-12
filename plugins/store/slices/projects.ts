import { RootState } from '@plugins/store';
import { FilterParams } from '@plugins/store/slices/filter';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QueriedProjects } from '@services/api/projects';
import { ProjectSummary } from '@services/api/projects';

export interface ProjectState {
  queriedProjects: QueriedProjects;
  filteredProjects: QueriedProjects;
  isFetching: boolean;
}

const initialState: ProjectState = {
  queriedProjects: [],
  filteredProjects: [],
  isFetching: false,
};

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

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setQueriedProjects: (state, action: PayloadAction<QueriedProjects>) => {
      state.queriedProjects = action.payload;
    },
    setFilteredProjects: (state, action: PayloadAction<FilterParams>) => {
      state.filteredProjects = state.queriedProjects.filter((project) =>
        checkFilter(project, action.payload)
      );
    },
    setIsFetching: (state, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
    },
  },
});

export const { setQueriedProjects, setFilteredProjects, setIsFetching } =
  projectSlice.actions;

export default projectSlice.reducer;

export const selectCountries = (state: RootState) => [
  ...new Set(state.project.filteredProjects.map((project) => project.country)),
];

export const selectResources = (state: RootState) => [
  ...new Set(state.project.filteredProjects.map((project) => project.resource)),
];

export const selectAllStatus = (state: RootState) => [
  ...new Set(state.project.filteredProjects.map((project) => project.status)),
];

export const selectAllCertifiedFSC = (state: RootState) => [
  ...new Set(
    state.project.filteredProjects.map((project) => project.certifiedFSC)
  ),
];

export const selectTotalMinSize = (state: RootState) =>
  state.project.filteredProjects.reduce((acc, project) => {
    return project.size < acc ? project.size : acc;
  }, Number.POSITIVE_INFINITY);

export const selectTotalMaxSize = (state: RootState) =>
  state.project.filteredProjects.reduce((acc, project) => {
    return project.size > acc ? project.size : acc;
  }, Number.NEGATIVE_INFINITY);

export const selectFilteredProjects = (state: RootState) =>
  state.project.filteredProjects;

export const selectIsFetching = (state: RootState) => state.project.isFetching;

export const selectFilteredProjectsCount = (state: RootState) =>
  state.project.filteredProjects.length;

export const selectQueriedProjectsCount = (state: RootState) =>
  state.project.queriedProjects.length;
