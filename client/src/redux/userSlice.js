import { createSlice } from "@reduxjs/toolkit";

/* --------------------------------------
   Cargar usuario desde localStorage SI LO HAY
---------------------------------------*/
const savedUser = localStorage.getItem("userData");
const savedToken = localStorage.getItem("token");

const initialState = {
  user: savedUser && savedToken 
    ? { user: JSON.parse(savedUser), token: savedToken }
    : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },

    logout: (state) => {
      state.user = null;
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
