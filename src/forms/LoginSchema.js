import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    email : yup.string().email().required("Your email is required"),
    password : yup.string().required("Your password is required").min(5,"Your password should be least 5 char")
});


export const resetSchema = yup.object().shape({
    resetEmail : yup.string().email().required("Your email is required")
});