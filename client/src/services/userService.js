import api from "./api";

export async function getProfile() {
  const res = await api.get("/api/profile");
  return res.data.user;
}

export async function updateProfile(data) {
  try {
    const res = await api.put("/api/profile/update", data);
    return { ok: true, user: res.data.user };
  } catch (err) {
    return { ok: false, msg: err.response?.data?.msg };
  }
}