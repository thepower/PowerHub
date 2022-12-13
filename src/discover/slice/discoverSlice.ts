import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Maybe } from 'typings/common';
import { DiscoverTabs } from '../typings/discoverTypings';

const SLICE_NAME = 'discover';

export type DiscoverState = {
  currentTab: DiscoverTabs;
  currentPageNumber: number;
  currentOpenedDappsId: Maybe<string>;
};

const initialState: DiscoverState = {
  currentTab: DiscoverTabs.Dapps,
  currentPageNumber: 1,
  currentOpenedDappsId: null,
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
    setCurrentOpenedDappsId: (state: DiscoverState, action: PayloadAction<string>) => {
      state.currentOpenedDappsId = action.payload;
    },
  },
});

const {
  reducer: discoverReducer,
  actions: {
    setCurrentDiscoverTab,
    setCurrentDiscoverPage,
    setCurrentOpenedDappsId,
  },
} = discoverSlice;

export {
  discoverReducer,
  setCurrentDiscoverTab,
  setCurrentDiscoverPage,
  setCurrentOpenedDappsId,
};
