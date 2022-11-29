import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../application/store';
import { DiscoverState } from '../slice/discoverSlice';

export const getDiscoverState = (state: RootState) => (
  state.discover
);

export const getCurrentDiscoverTab = createSelector(
  getDiscoverState,
  (state: DiscoverState) => state.currentTab,
);

export const getCurrentDiscoverPage = createSelector(
  getDiscoverState,
  (state: DiscoverState) => state.currentPageNumber,
);
