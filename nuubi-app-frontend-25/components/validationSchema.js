const Yup = require("yup");
const YupPassword = require("yup-password");
YupPassword(Yup);

const formSchema = Yup.object({
  username: Yup.string().trim().required("Username or email required"),
  password: Yup.string().required("Password required"),
});

const changeUsernameSchema = Yup.object({
  username: Yup.string()
    .required("Username required")
    .min(3, "Username must be at least 3 characters")
    .max(28, "Username can be maximum 28 characters")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "Username cannot contain white space or special characters"
    ),
  password: Yup.string().required("Password required"),
});

const formSignupSchema = Yup.object({
  email: Yup.string()
    .required("Valid email required")
    .trim()
    .email("Valid email required"),
  password: Yup.string()
    .required("Password required")
    .min(8, "Password must contain at least 8 characters")
    .max(28, "Password can be a maximum of 28 characters")
    .minLowercase(1, "Password must contain at least 1 lower case letter")
    .minUppercase(1, "Password must contain at least 1 upper case letter")
    .minNumbers(1, "Password must contain at least 1 number")
    .minSymbols(1, "Password must contain at least 1 special character"),
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,28})/,
  //   "Must Contain 8 to 28 Characters, One Uppercase, One Lowercase, One Number and One Special Character"
  // ),
  password2: Yup.string()
    .required("Password required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const newPasswordSchema = Yup.object({
  password: Yup.string().required("Password required"),
  passattempt1: Yup.string()
    .required("Password required")
    .min(8, "Password must contain at least 8 characters")
    .max(28, "Password can be a maximum of 28 characters")
    .minLowercase(1, "Password must contain at least 1 lower case letter")
    .minUppercase(1, "Password must contain at least 1 upper case letter")
    .minNumbers(1, "Password must contain at least 1 number")
    .minSymbols(1, "Password must contain at least 1 special character"),
  passattempt2: Yup.string()
    .required("Password required")
    .oneOf([Yup.ref("passattempt1"), null], "Passwords must match"),
});

const forgotPasswordSchema = Yup.object({
  passcode: Yup.string().required("Passcode is required"),
  passattempt1: Yup.string()
    .required("Password required")
    .min(6, "Password too short")
    .max(28, "Password too long!"),
  passattempt2: Yup.string()
    .required("Password required")
    .min(6, "Password too short")
    .max(28, "Password too long!")
    .oneOf([Yup.ref("passattempt1"), null], "Passwords don't match!"),
});

const addMessageSchema = Yup.object({
  mymessage: Yup.string()
    .required("Message is required")
    .min(1, "Message must be at least 1 character")
    .max(500, "Message cannot exceed 500 characters"),
});

const addCommentSchema = Yup.object({
  mycomment: Yup.string()
    .required("Comment is required")
    .min(1, "Comment must be at least 1 character")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

const createGroupSchema = Yup.object({
  groupname: Yup.string()
    .required("Name is required")
    .min(1, "Name must be at least one character")
    .max(35, "Name cannot exceed 35 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(1, "Description must be at least 1 character")
    .max(400, "Description cannot exceed 400 characters"),
});

const createPostSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(1, "Title must be at least one character")
    .max(80, "Title cannot exceed 80 characters"),
  body_text: Yup.string()
    .required("Body text is required")
    .min(1, "Body text must be at least 1 character")
    .max(4000, "Body text cannot exceed 4000 characters"),
});

const createTaskSchema = Yup.object({
  task: Yup.string()
    .required("Task is required")
    .min(1, "Task must be at least one character")
    .max(80, "Task cannot exceed 80 characters"),
  pointValue: Yup.number()
    .required("Points are required")
    .min(1, "Points must be at least 1")
    .max(100, "Points cannot exceed 100"),
});

module.exports = {
  formSchema,
  newPasswordSchema,
  formSignupSchema,
  forgotPasswordSchema,
  addMessageSchema,
  createGroupSchema,
  createPostSchema,
  addCommentSchema,
  changeUsernameSchema,
  createTaskSchema,
};
