import * as yup from 'yup';

export const signUpSchema = yup.object().shape({
    name : yup.string().trim().required("Your name is required").min(3,"Your name should be least 3 char"),
    surname : yup.string().trim().required("Your surname is required").min(3,"Your surname should be least 3 char"),
    email : yup.string().email().required("Your email is required"),
    password : yup.string().required("Your password is required").min(6,"Your password should be least 6 char"),
    confirmPassword: yup.string().required("Password confirmation is required").oneOf([yup.ref('password')], 'Your passwords do not match.')
});