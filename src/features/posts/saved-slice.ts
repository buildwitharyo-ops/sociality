import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// The API doesn't expose a per-post "saved" flag on post objects, so we track
// saved post ids on the client. Seeded from GET /api/me/saved (Step 9) and kept
// in sync by the save/unsave toggle.
export interface SavedState {
  ids: Record<number, boolean>;
}

const initialState: SavedState = { ids: {} };

const savedSlice = createSlice({
  name: "saved",
  initialState,
  reducers: {
    setSaved(state, action: PayloadAction<{ postId: number; saved: boolean }>) {
      state.ids[action.payload.postId] = action.payload.saved;
    },
    seedSaved(state, action: PayloadAction<number[]>) {
      for (const id of action.payload) state.ids[id] = true;
    },
  },
});

export const { setSaved, seedSaved } = savedSlice.actions;
export default savedSlice.reducer;

export const selectIsSaved = (state: { saved: SavedState }, postId: number): boolean =>
  state.saved.ids[postId] ?? false;
