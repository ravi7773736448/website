import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchDashboardSummary,
  fetchWebsites,
  deleteWebsite as deleteWebsiteApi,
  triggerWebsiteCheck as triggerWebsiteCheckApi,
  createWebsite as createWebsiteApi
} from '../services/website.api';
import {
  transformDashboardResponse,
  transformWebsitesResponse,
  mapSummaryToStats
} from '../services/dashboard.service';

/**
 * Async Thunks
 */
export const loadDashboardSummary = createAsyncThunk(
  'dashboard/loadSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchDashboardSummary();
      return transformDashboardResponse(response);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to load dashboard');
    }
  }
);

export const loadWebsites = createAsyncThunk(
  'dashboard/loadWebsites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchWebsites();
      return transformWebsitesResponse(response);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to load websites');
    }
  }
);

export const deleteWebsiteThunk = createAsyncThunk(
  'dashboard/deleteWebsite',
  async (id, { rejectWithValue }) => {
    try {
      await deleteWebsiteApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to delete website');
    }
  }
);

export const triggerWebsiteCheckThunk = createAsyncThunk(
  'dashboard/triggerCheck',
  async (id, { rejectWithValue }) => {
    try {
      const response = await triggerWebsiteCheckApi(id);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to trigger check');
    }
  }
);

export const createWebsiteThunk = createAsyncThunk(
  'dashboard/createWebsite',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createWebsiteApi(data);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to create website');
    }
  }
);

/**
 * Dashboard Slice
 */
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    summary: {
      total: 0,
      up: 0,
      down: 0,
      slow: 0,
      unknown: 0
    },
    stats: [],
    websites: [],
    recentWebsites: [],
    isLoading: false,
    isLoadingSummary: false,
    isLoadingWebsites: false,
    error: null,
    successMessage: null,
    websiteCount: 0
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    // Load Dashboard Summary
    builder
      .addCase(loadDashboardSummary.pending, (state) => {
        state.isLoadingSummary = true;
        state.error = null;
      })
      .addCase(loadDashboardSummary.fulfilled, (state, action) => {
        state.isLoadingSummary = false;
        state.summary = action.payload.summary || state.summary;
        state.recentWebsites = action.payload.recentWebsites || [];
        state.stats = mapSummaryToStats(state.summary);
        state.error = null;
      })
      .addCase(loadDashboardSummary.rejected, (state, action) => {
        state.isLoadingSummary = false;
        state.error = action.payload || 'Failed to load dashboard';
      });

    // Load Websites
    builder
      .addCase(loadWebsites.pending, (state) => {
        state.isLoadingWebsites = true;
        state.error = null;
      })
      .addCase(loadWebsites.fulfilled, (state, action) => {
        state.isLoadingWebsites = false;
        state.websites = action.payload.websites || [];
        state.websiteCount = action.payload.count || 0;
        state.error = null;
      })
      .addCase(loadWebsites.rejected, (state, action) => {
        state.isLoadingWebsites = false;
        state.error = action.payload || 'Failed to load websites';
      });

    // Delete Website
    builder
      .addCase(deleteWebsiteThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteWebsiteThunk.fulfilled, (state, action) => {
        state.websites = state.websites.filter(w => w.id !== action.payload);
        state.websiteCount = Math.max(0, state.websiteCount - 1);
        state.successMessage = 'Website deleted successfully';
        state.error = null;
      })
      .addCase(deleteWebsiteThunk.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete website';
      });

    // Trigger Check
    builder
      .addCase(triggerWebsiteCheckThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(triggerWebsiteCheckThunk.fulfilled, (state) => {
        state.successMessage = 'Website check triggered';
        state.error = null;
      })
      .addCase(triggerWebsiteCheckThunk.rejected, (state, action) => {
        state.error = action.payload || 'Failed to trigger check';
      });

    // Create Website
    builder
      .addCase(createWebsiteThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createWebsiteThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.successMessage = 'Website added successfully';
        state.error = null;
        // Note: dashboard will be reloaded after this
      })
      .addCase(createWebsiteThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create website';
      });
  }
});

export const { clearError, clearSuccess } = dashboardSlice.actions;
export default dashboardSlice.reducer;
