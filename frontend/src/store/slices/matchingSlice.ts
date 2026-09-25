import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  lastDonation: string;
  location: string;
  distance: number;
  availability: string[];
  contact: {
    phone: string;
    email: string;
  };
}

export interface Recipient {
  id: string;
  name: string;
  bloodGroup: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  distance: number;
  requiredBy: string;
  contact: {
    phone: string;
    email: string;
  };
}

interface MatchingState {
  donors: Donor[];
  recipients: Recipient[];
  filters: {
    bloodGroup: string;
    distance: number;
    searchQuery: string;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: MatchingState = {
  donors: [],
  recipients: [],
  filters: {
    bloodGroup: '',
    distance: 50,
    searchQuery: '',
  },
  isLoading: false,
  error: null,
};

const matchingSlice = createSlice({
  name: 'matching',
  initialState,
  reducers: {
    setDonors: (state, action: PayloadAction<Donor[]>) => {
      state.donors = action.payload;
    },
    setRecipients: (state, action: PayloadAction<Recipient[]>) => {
      state.recipients = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<MatchingState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setDonors,
  setRecipients,
  setFilters,
  resetFilters,
  setLoading,
  setError,
} = matchingSlice.actions;

export const selectDonors = (state: { matching: MatchingState }) => state.matching.donors;
export const selectRecipients = (state: { matching: MatchingState }) => state.matching.recipients;
export const selectFilters = (state: { matching: MatchingState }) => state.matching.filters;
export const selectIsLoading = (state: { matching: MatchingState }) => state.matching.isLoading;

export default matchingSlice.reducer;
