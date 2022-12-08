import { RootState } from '@plugins/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Filter, FilterParams, QueriedProjects } from '@services/api/projects';

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
    setCountry: (state, action: PayloadAction<string | undefined>) => {
      state.country = action.payload;
    },
    setResource: (state, action: PayloadAction<string | undefined>) => {
      state.resource = action.payload;
    },
    setStatus: (state, action: PayloadAction<string | undefined>) => {
      state.status = action.payload;
    },
    setCertifiedFSC: (state, action: PayloadAction<boolean | undefined>) => {
      state.certifiedFSC = action.payload;
    },
    unsetFilter: (state, action: PayloadAction<Filter>) => {
      state[action.payload] = undefined;
    },
  },
});

export const {
  setQueriedProjects,
  setQueryLoading,
  setCountry,
  setResource,
  setStatus,
  setCertifiedFSC,
  unsetFilter,
} = projectSlice.actions;

export default projectSlice.reducer;

export const selectCountry = (state: RootState) => state.project.country;

export const selectResource = (state: RootState) => state.project.resource;

export const selectStatus = (state: RootState) => state.project.status;

export const selectCertifiedFCS = (state: RootState) =>
  state.project.certifiedFSC;

export const selectCountries = (state: RootState) => [
  ...new Set(state.project.queriedProjects.map((project) => project.country)),
];

export const selectResources = (state: RootState) => [
  ...new Set(state.project.queriedProjects.map((project) => project.resource)),
];

export const selectAllStatus = (state: RootState) => [
  ...new Set(state.project.queriedProjects.map((project) => project.status)),
];

export const selectAllCertifiedFSC = (state: RootState) => [
  ...new Set(
    state.project.queriedProjects.map((project) => project.certifiedFSC)
  ),
];

export const selectTotalMinSize = (state: RootState) =>
  state.project.queriedProjects.reduce((acc, project) => {
    return project.size < acc ? project.size : acc;
  }, Number.POSITIVE_INFINITY);

export const selectTotalMaxSize = (state: RootState) =>
  state.project.queriedProjects.reduce((acc, project) => {
    return project.size > acc ? project.size : acc;
  }, Number.NEGATIVE_INFINITY);

export const selectFilter = (state: RootState) =>
  Object.entries(state.project).reduce((acc: FilterParams, entry) => {
    if (
      !entry[0].match(/(queriedProjects)|(queryLoading)/) &&
      entry[1] !== undefined
    ) {
      acc[entry[0] as keyof FilterParams] = entry[1];
    }
    return acc;
  }, {});
