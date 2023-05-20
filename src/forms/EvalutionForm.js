import * as yup from 'yup';

export const evaluateSchema = yup.object().shape({
    answer1 : yup.boolean().required("Please answer questions").oneOf([true,false]),
    answer2 : yup.boolean().required("Please answer questions").oneOf([true,false]),
    answer3 : yup.boolean().required("Please answer questions").oneOf([true,false]),
    comment : yup.string().required("Comment is required !").min(12,"The comment should be least 12 char !")
});