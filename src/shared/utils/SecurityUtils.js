class SecurityUtils {
    static PASSWORD_REQUIREMENTS = {
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8'),
    requireUppercase: (process.env.PASSWORD_REQUIRE_UPPERCASE || 'true') === 'true',
    requireLowercase: (process.env.PASSWORD_REQUIRE_LOWERCASE || 'true') === 'true',
    requireNumbers: (process.env.PASSWORD_REQUIRE_NUMBERS || 'true') === 'true',
    requireSymbols: (process.env.PASSWORD_REQUIRE_SYMBOLS || 'true') === 'true',
}

static validatePassword(password) {
    const errors = []

    if(!password){
        return({
            success: false,
            errors: ['Password is required']
        }
        )
    }
    const { minLength, requireUppercase, requireLowercase, requireNumbers, requireSymbols } = this.PASSWORD_REQUIREMENTS;  
    if (password.length < minLength) {
        errors.push(`Password length must be atleast ${minLength} long`)
    }

    if(requireUppercase && !/[A-Z]/.test(password)){
        errors.push(`Password must contain at least one uppercase letter`)
    }

    if(requireLowercase&& !/[a-z]/.test(password)){
        errors.push(`Password must contain at least one lowercase letter`)
    }

    if(requireNumbers && !/[0-9]/.test(password)){
        errors.push(`Password must contain at least one number`)
    }

    if(requireSymbols && !/[^A-Za-z0-9]/.test(password)){
        errors.push(`Password must contain at least one special character`)
    }

     // Check for common weak passwords
        const weakPasswords = [
            'password', '123456', 'qwerty', 'admin', 'letmein',
            'password123', 'admin123', '12345678', 'welcome'
        ];

        if (weakPasswords.includes(password.toLowerCase())) {
            errors.push('Password is too common and easily guessable');
        }

        return{
            success: errors.length ===0,
            errors,
        }


}
}

export default SecurityUtils;