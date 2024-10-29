

export const validateSignupData = (req) => {
    const signupAllowedFields = ["firstName","lastName","email","password"]
    const isAllowed = Object.keys(req.body).every((item)=> signupAllowedFields.includes(item));
    return isAllowed;
}

export const validateEditProfile = (req) => {
    const allowedEditFields = ["firstName","lastName","age","photoURL","gender","skills"];
    const isAllowed = Object.keys(req.body).every(item => allowedEditFields.includes(item));
    return isAllowed;
}
