import { RootState } from '@plugins/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterParams, QueriedProjects } from '@services/api/projects';

export interface ProjectState extends FilterParams {
  queriedProjects: QueriedProjects;
  queryLoading: boolean;
}

const initialState: ProjectState = {
  queriedProjects: [],
  queryLoading: false,
  country: undefined,
  resource: undefined,
  status: undefined,
  minSize: undefined,
  maxSize: undefined,
  certifiedFSC: undefined,
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setQueriedProjects: (state, action: PayloadAction<QueriedProjects>) => {
      state.queriedProjects = action.payload;
    },
    setQueryLoading: (state, action: PayloadAction<boolean>) => {
      state.queryLoading = action.payload;
    },
  },
});

export const { setQueriedProjects, setQueryLoading } = projectSlice.actions;

export default projectSlice.reducer;

export const selectCountries = (state: RootState) => [
  ...new Set(state.project.queriedProjects.map((project) => project.country)),
];

export const selectResource = (state: RootState) => [
  ...new Set(state.project.queriedProjects.map((project) => project.resource)),
];

export const selectStatus = (state: RootState) => [
  ...new Set(state.project.queriedProjects.map((project) => project.status)),
];

export const selectCertifiedFSC = (state: RootState) => [
  ...new Set(
    state.project.queriedProjects.map((project) => project.certifiedFSC)
  ),
];

export const selectMinSize = (state: RootState) =>
  state.project.queriedProjects.reduce((acc, project) => {
    return project.size < acc ? project.size : acc;
  }, Number.POSITIVE_INFINITY);

export const selectMaxSize = (state: RootState) =>
  state.project.queriedProjects.reduce((acc, project) => {
    return project.size > acc ? project.size : acc;
  }, Number.NEGATIVE_INFINITY);

export const selectFilter = (state: RootState) =>
  Object.entries(state.project).reduce((acc: FilterParams, entry) => {
    if (entry[0] !== 'queriedProjects' && entry[1] !== undefined) {
      acc[entry[0] as keyof FilterParams] = entry[1];
    }
    return acc;
  }, {});
