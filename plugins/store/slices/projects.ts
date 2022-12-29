import { RootState } from '@plugins/store';
import { FilterParams } from '@plugins/store/slices/filter';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectFilter, QueriedProjectSummary } from '@services/api/projects';

export interface ProjectState {
  QueriedProject: QueriedProjectSummary[];
  filteredProjects: QueriedProjectSummary[];
}

const initialState: ProjectState = {
  QueriedProject: [],
  filteredProjects: [],
};

const checkFilter = (
  project: QueriedProjectSummary,
  filterParams: FilterParams
): boolean => {
  let filter: keyof FilterParams;
  for (filter in filterParams) {
    if (typeof filterParams[filter] === 'number') continue;

    if (filter === 'search') {
      const query = new RegExp(filterParams.search ?? '', 'ig');
      const queryResult = Object.values(project)
        .filter((value) => typeof value === 'string')
        .some((value) => !!(value as unknown as string).match(query));

      if (!queryResult) return false;
      if (queryResult) continue;
    }

    if (project[filter as keyof ProjectFilter] !== filterParams[filter])
      return false;
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
    setQueriedProjects: (
      state,
      action: PayloadAction<QueriedProjectSummary[]>
    ) => {
      state.QueriedProject = action.payload;
    },
    setFilteredProjects: (state, action: PayloadAction<FilterParams>) => {
      state.filteredProjects = state.QueriedProject.filter(
        (project: QueriedProjectSummary) => checkFilter(project, action.payload)
      );
    },
  },
});

export const { setQueriedProjects, setFilteredProjects } = projectSlice.actions;

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

export const selectFilteredProjectsCount = (state: RootState) =>
  state.project.filteredProjects.length;

export const selectQueriedProjectsCount = (state: RootState) =>
  state.project.QueriedProject.length;
