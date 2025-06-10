import { createSlice } from "@reduxjs/toolkit";

interface userType {
  id: string;
  name: string;
  profilePicture: string;
  email: string;
  token: string;
}

interface user {
  user: userType;
}

const initialState: user = {
  user: {
    id: "",
    name: "",
    email: "",
    profilePicture: "",
    token: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    resetUser: (state) => {
      state.user = {
        id: "",
        name: "",
        email: "",
        profilePicture: "",
        token: "",
      };
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
