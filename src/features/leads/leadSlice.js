import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch leads content from the server
export const getLeadsContent = createAsyncThunk('/leads/content', async () => {
    const response = await axios.get('/api/users?page=2', {});
    return response.data;
});

// Update a lead on the server
export const updateLeadOnServer = createAsyncThunk('/leads/update', async (lead) => {
    const response = await axios.put(`/api/users/${lead.id}`, lead);  // Assumes lead has an `id` field
    return response.data;
});

export const leadsSlice = createSlice({
    name: 'leads',
    initialState: {
        isLoading: false,
        leads: []
    },
    reducers: {
        addNewLead: (state, action) => {
            const { newLeadObj } = action.payload;
            state.leads = [...state.leads, newLeadObj];
        },

        deleteLead: (state, action) => {
            const { index } = action.payload;
            state.leads.splice(index, 1);
        },

        // Add an updateLead reducer
        updateLead: (state, action) => {
            const updatedLead = action.payload;
            state.leads = state.leads.map((lead) =>
                lead.id === updatedLead.id ? updatedLead : lead
            );
        }
    },

    extraReducers: {
        [getLeadsContent.pending]: state => {
            state.isLoading = true;
        },
        [getLeadsContent.fulfilled]: (state, action) => {
            state.leads = action.payload.data;
            state.isLoading = false;
        },
        [getLeadsContent.rejected]: state => {
            state.isLoading = false;
        },

        [updateLeadOnServer.pending]: state => {
            state.isLoading = true;
        },
        [updateLeadOnServer.fulfilled]: (state, action) => {
            // Assuming the server response contains the updated lead
            const updatedLead = action.payload;
            state.leads = state.leads.map((lead) =>
                lead.id === updatedLead.id ? updatedLead : lead
            );
            state.isLoading = false;
        },
        [updateLeadOnServer.rejected]: state => {
            state.isLoading = false;
        }
    }
});

export const { addNewLead, deleteLead, updateLead } = leadsSlice.actions;

export default leadsSlice.reducer;
