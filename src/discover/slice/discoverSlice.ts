import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DiscoverTabs } from '../typings/discoverTypings';

const SLICE_NAME = 'discover';

export type DiscoverState = {
  currentTab: DiscoverTabs;
  currentPageNumber: number;
};

const initialState: DiscoverState = {
  currentTab: DiscoverTabs.Dapps,
  currentPageNumber: 1,
};

const discoverSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setCurrentDiscoverTab: (state: DiscoverState, action: PayloadAction<DiscoverTabs>) => {
      state.currentTab = action.payload;
    },
    setCurrentDiscoverPage: (state: DiscoverState, action: PayloadAction<number>) => {
      state.currentPageNumber = action.payload;
    },
  },
});

const {
  reducer: discoverReducer,
  actions: {
    setCurrentDiscoverTab,
    setCurrentDiscoverPage,
  },
} = discoverSlice;

export {
  discoverReducer,
  setCurrentDiscoverTab,
  setCurrentDiscoverPage,
};
