import { createSelector } from '@reduxjs/toolkit';
import { dappsData, nftListData } from 'discover/utils/dappsData';
import { RootState } from '../../application/store';
import { DiscoverState } from '../slice/discoverSlice';

export const getDiscoverState = (state: RootState) => (
  state.discover
);

export const getCurrentDiscoverTab = createSelector(
  getDiscoverState,
  (state: DiscoverState) => state.currentTab,
);

export const getDappsCardData = (id: string) => (
  dappsData.find((dappsData) => dappsData.id === id)
);

export const getNftCollectionCardData = (id: string) => (
  nftListData.find((data) => data.id === id)
);
