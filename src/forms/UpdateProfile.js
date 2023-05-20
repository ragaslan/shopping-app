import * as yup from 'yup';

export const updateSchema = yup.object().shape({
    name : yup.string().trim().required("Your name is required").min(3,"Your name should be least 3 char"),
    surname : yup.string().trim().required("Your surname is required").min(3,"Your surname should be least 3 char")
});