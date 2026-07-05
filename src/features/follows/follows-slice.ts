import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { clearSession } from "@/features/auth/auth-slice";

// Follow state keyed by username. Seeded lazily from user objects' isFollowedByMe
// and kept in sync by the follow toggle, so every UserChip for the same person
// stays consistent across lists (likers, search, followers/following).
export interface FollowsState {
  map: Record<string, boolean>;
}

const initialState: FollowsState = { map: {} };

const followsSlice = createSlice({
  name: "follows",
  initialState,
  reducers: {
    setFollowing(state, action: PayloadAction<{ username: string; following: boolean }>) {
      state.map[action.payload.username] = action.payload.following;
    },
  },
  extraReducers: (builder) => {
    // Don't carry one user's follow state into the next session.
    builder.addCase(clearSession, () => initialState);
  },
});

export const { setFollowing } = followsSlice.actions;
export default followsSlice.reducer;

export const selectIsFollowing = (
  state: { follows: FollowsState },
  username: string,
): boolean | undefined => state.follows.map[username];
