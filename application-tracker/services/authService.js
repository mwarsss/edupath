import axios from "axios";

export const register = async (username, email, password, confirmPassword) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/register/", {
      username,
      email,
      password,
      confirm_password: confirmPassword,
    });
    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, error: error.response.data.error };
  }
};
