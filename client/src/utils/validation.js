export const validateRegister = (formData) => {
    const errors = {};

    // Full Name
    if (!formData.name.trim()) {
        errors.name = "Full Name is required";
    }

    // Email
    if (!formData.email.trim()) {
        errors.email = "Email is required";
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
        errors.email = "Please enter a valid email address";
    }

    // Password
    if (!formData.password) {
        errors.password = "Password is required";
    } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    }

    // Confirm Password
    if (!formData.confirmPassword) {
        errors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    // Role
    if (!formData.role) {
        errors.role = "Please select a role";
    }

    return errors;
};


export const validateLogin = (formData) => {
    const errors = {};

    // Email
    if (!formData.email.trim()) {
        errors.email = "Email is required";
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
        errors.email = "Please enter a valid email address";
    }

    // Password
    if (!formData.password) {
        errors.password = "Password is required";
    }

    return errors;
};