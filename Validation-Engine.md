/**
   * VALIDATION ENGINE MODULE
   * Purpose: Centralized validation logic for all booking flows
   * Reusable: YES - Works across ALL industries
   */

  // PHONE VALIDATION & FORMATTING
  function validatePhone(input) {
    const phonePattern =
  /^(\+?1[-.]?)?(\()?([0-9]{3})(\))?[-.]?([0-9]{3})[-.]?([0-9]{4})$|^([0-9]{10})$/;
    const cleanMessage = input.replace(/[\s\-\(\)\.]/g, '');
    return phonePattern.test(cleanMessage);
  }

  function formatPhone(input) {
    const cleanMessage = input.replace(/[\s\-\(\)\.]/g, '');
    let formattedPhone = cleanMessage;

    if (cleanMessage.length === 10) {
      formattedPhone = `+1${cleanMessage}`;
    } else if (cleanMessage.startsWith('1') && cleanMessage.length === 11) {
      formattedPhone = `+${cleanMessage}`;
    } else if (cleanMessage.startsWith('+1')) {
      formattedPhone = cleanMessage;
    } else if (cleanMessage.startsWith('+') && cleanMessage.length === 12) {
      formattedPhone = cleanMessage;
    } else {
      formattedPhone = `+1${cleanMessage.replace(/^\+?1?/, '')}`;
    }

    return formattedPhone;
  }

  // EMAIL VALIDATION & CORRECTION
  function validateEmail(input) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(input);
  }

  function correctCommonEmailDomains(email) {
    const commonDomains = {
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'gmil.com': 'gmail.com',
      'yahooo.com': 'yahoo.com',
      'yaho.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com',
      'hotmai.com': 'hotmail.com',
      'outlok.com': 'outlook.com',
      'outloo.com': 'outlook.com'
    };

    const parts = email.split('@');
    if (parts.length === 2) {
      const domain = parts[1].toLowerCase();
      if (commonDomains[domain]) {
        return `${parts[0]}@${commonDomains[domain]}`;
      }
    }

    return email;
  }

  // NAME VALIDATION & FORMATTING
  function validateFullName(input) {
    const nameMatch = input.match(/^([A-Za-z]+)[\s]+([A-Za-z]+)$/);
    return nameMatch !== null;
  }

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  function formatFullName(input) {
    const nameMatch = input.match(/^([A-Za-z]+)[\s]+([A-Za-z]+)$/);
    if (nameMatch) {
      const firstName = capitalizeFirstLetter(nameMatch[1]);
      const lastName = capitalizeFirstLetter(nameMatch[2]);
      return { firstName, lastName, fullName: `${firstName} ${lastName}` };
    }
    return null;
  }

  // DATE OF BIRTH VALIDATION & FORMATTING
  function validateDateOfBirth(input) {
    const formats = [
      /^(0[1-9]|1[0-2])[\/\-](0[1-9]|[12][0-9]|3[01])[\/\-](19|20)\d{2}$/,
      /^(19|20)\d{2}[\/\-](0[1-9]|1[0-2])[\/\-](0[1-9]|[12][0-9]|3[01])$/
    ];

    return formats.some(format => format.test(input));
  }

  function formatDateOfBirth(input) {
    let month, day, year;

    let match =
  input.match(/^(0[1-9]|1[0-2])[\/\-](0[1-9]|[12][0-9]|3[01])[\/\-](19|20)\d{2}$/);
    if (match) {
      month = match[1];
      day = match[2];
      year = match[3];
      return `${month}/${day}/${year}`;
    }

    match =
  input.match(/^(19|20)\d{2}[\/\-](0[1-9]|1[0-2])[\/\-](0[1-9]|[12][0-9]|3[01])$/);
    if (match) {
      year = match[1] + match[2].slice(0, 2);
      month = match[2].slice(2);
      day = match[3];
      return `${month}/${day}/${year}`;
    }

    return input;
  }

  // PAIN LEVEL VALIDATION
  function validatePainLevel(input) {
    const painLevel = parseInt(input);
    return !isNaN(painLevel) && painLevel >= 1 && painLevel <= 10;
  }

  // POLICY HOLDER NAME VALIDATION
  function validatePolicyHolderName(input) {
    const nameMatch = input.match(/^([A-Za-z]+)[\s]+([A-Za-z]+)$/);
    return nameMatch !== null;
  }

  function formatPolicyHolderName(input) {
    const nameMatch = input.match(/^([A-Za-z]+)[\s]+([A-Za-z]+)$/);
    if (nameMatch) {
      return `${capitalizeFirstLetter(nameMatch[1])} 
  ${capitalizeFirstLetter(nameMatch[2])}`;
    }
    return input;
  }

  // UTILITY FUNCTIONS
  function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // EXPORT MODULE
  return {
    json: {
      module: 'Validation-Engine',
      version: '1.0.0',
      functions: {
        validatePhone,
        formatPhone,
        validateEmail,
        correctCommonEmailDomains,
        validateFullName,
        formatFullName,
        capitalizeFirstLetter,
        validateDateOfBirth,
        formatDateOfBirth,
        validatePainLevel,
        validatePolicyHolderName,
        formatPolicyHolderName,
        getRandomResponse
      },
      status: 'ready'
    }
  };