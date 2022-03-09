import axios from "axios";
import { REGISTER_FAIL, REGISTER_SUCCESS } from "./types";
import { setAlert } from "./alert";

//Register User-
export const register = ({ name, email, password }) => {
  return async (dispatch) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = {
        name,
        email,
        password,
      };
      const res = await axios.post("/api/register", body, config);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };
};
