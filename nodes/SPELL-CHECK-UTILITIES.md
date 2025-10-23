# SPELL-CHECK UTILITIES
## Comprehensive Spell-Checking Functions for All N8N Workflow Nodes

**Purpose:** Auto-correct common typos in all user text inputs across the booking flow

**Integration:** Copy these functions into each N8N workflow node that processes user text input

---

## 1. NAME SPELL-CHECK
```javascript
function spellCheckName(str) {
  const commonNameCorrections = {
    // First names
    'jogn': 'john', 'jhon': 'john', 'jon': 'john',
    'jame': 'james', 'jaymes': 'james',
    'micheal': 'michael', 'michale': 'michael', 'maichael': 'michael',
    'rober': 'robert', 'robet': 'robert',
    'willam': 'william', 'willim': 'william',
    'chritopher': 'christopher', 'christoper': 'christopher', 'cristopher': 'christopher',
    'davids': 'david', 'devid': 'david',
    'mathew': 'matthew', 'mat': 'matt',
    'anrew': 'andrew', 'andew': 'andrew',
    'alen': 'alan', 'allan': 'alan',

    // Last names
    'smtih': 'smith', 'smit': 'smith',
    'jhonson': 'johnson', 'jonson': 'johnson',
    'jhones': 'jones', 'jone': 'jones',
    'willams': 'williams', 'willaims': 'williams',
    'browm': 'brown', 'brwon': 'brown',
    'millar': 'miller', 'miler': 'miller',
    'daviss': 'davis', 'dav is': 'davis',
    'wilson': 'wilson', 'wils on': 'wilson',
    'andersen': 'anderson', 'andeson': 'anderson'
  };

  const lowerStr = str.toLowerCase().trim();
  const corrected = commonNameCorrections[lowerStr] || lowerStr;
  return corrected.charAt(0).toUpperCase() + corrected.slice(1);
}
```

---

## 2. EMAIL DOMAIN SPELL-CHECK
```javascript
function spellCheckEmail(email) {
  const emailDomainCorrections = {
    // Common email providers
    'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gamil.com': 'gmail.com',
    'g mail.com': 'gmail.com', 'gmail.con': 'gmail.com', 'gmil.com': 'gmail.com',

    'yahooo.com': 'yahoo.com', 'yahoo.con': 'yahoo.com', 'yaho.com': 'yahoo.com',
    'yhaoo.com': 'yahoo.com', 'yahho.com': 'yahoo.com',

    'hotmial.com': 'hotmail.com', 'hotmai.com': 'hotmail.com', 'hotmil.com': 'hotmail.com',
    'hot mail.com': 'hotmail.com', 'hotmail.con': 'hotmail.com',

    'outlok.com': 'outlook.com', 'outloo.com': 'outlook.com', 'outlook.con': 'outlook.com',

    'aol.con': 'aol.com', 'alo.com': 'aol.com',

    'icloud.con': 'icloud.com', 'iclod.com': 'icloud.com', 'icoud.com': 'icloud.com'
  };

  const emailParts = email.toLowerCase().trim().split('@');
  if (emailParts.length === 2) {
    const domain = emailParts[1];
    const correctedDomain = emailDomainCorrections[domain] || domain;
    return `${emailParts[0]}@${correctedDomain}`;
  }
  return email;
}
```

---

## 3. MEDICAL TERMS SPELL-CHECK
```javascript
function spellCheckMedicalTerms(text) {
  const medicalTermCorrections = {
    // Body parts
    'sholder': 'shoulder', 'sholders': 'shoulders',
    'kne': 'knee', 'knea': 'knee',
    'bak': 'back', 'bakc': 'back',
    'nek': 'neck', 'nec': 'neck',
    'hed': 'head', 'haed': 'head',
    'stomache': 'stomach', 'stomac': 'stomach',
    'cheast': 'chest', 'ches': 'chest',
    'ankel': 'ankle', 'ancle': 'ankle',
    'wrist': 'wrist', 'wris': 'wrist',

    // Symptoms
    'painfull': 'painful', 'panful': 'painful',
    'dizzy': 'dizzy', 'dizy': 'dizzy',
    'nausia': 'nausea', 'nausea': 'nausea',
    'hedache': 'headache', 'headach': 'headache',
    'fatigue': 'fatigue', 'fatige': 'fatigue',
    'sweling': 'swelling', 'swelling': 'swelling',
    'numbnes': 'numbness', 'numness': 'numbness',
    'brething': 'breathing', 'breathng': 'breathing',

    // Common medical terms
    'apointment': 'appointment', 'appointemnt': 'appointment',
    'insurence': 'insurance', 'insuranse': 'insurance',
    'perscription': 'prescription', 'presciption': 'prescription',
    'medicne': 'medicine', 'medecine': 'medicine',
    'surgery': 'surgery', 'surgary': 'surgery',
    'injurie': 'injury', 'ingury': 'injury',
    'treatement': 'treatment', 'tretment': 'treatment'
  };

  let corrected = text.toLowerCase();

  // Replace each misspelling with correct spelling
  Object.keys(medicalTermCorrections).forEach(misspelling => {
    const regex = new RegExp(`\\b${misspelling}\\b`, 'gi');
    corrected = corrected.replace(regex, medicalTermCorrections[misspelling]);
  });

  return corrected;
}
```

---

## 4. INSURANCE PROVIDER SPELL-CHECK
```javascript
function spellCheckInsurance(providerName) {
  const insuranceCorrections = {
    // Major insurance providers
    'aetna': 'aetna', 'aenta': 'aetna', 'aenta': 'aetna',
    'bluecros': 'blue cross', 'blue cros': 'blue cross', 'bluecross': 'blue cross',
    'blueshield': 'blue shield', 'blue sheild': 'blue shield',
    'cigna': 'cigna', 'cignaa': 'cigna',
    'unitedhealth': 'united health', 'united helth': 'united health',
    'unitdhealthcare': 'united healthcare', 'unitedhealthcare': 'united healthcare',
    'humana': 'humana', 'humanna': 'humana',
    'kaiser': 'kaiser', 'kais er': 'kaiser', 'kayser': 'kaiser',
    'anthem': 'anthem', 'anthen': 'anthem',
    'medicare': 'medicare', 'medi care': 'medicare', 'mediare': 'medicare',
    'medicaid': 'medicaid', 'medi caid': 'medicaid', 'medicad': 'medicaid',
    'tricare': 'tricare', 'tri care': 'tricare'
  };

  const lowerProvider = providerName.toLowerCase().trim();
  const corrected = insuranceCorrections[lowerProvider] || lowerProvider;

  // Capitalize each word
  return corrected.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
```

---

## 5. GENERAL TEXT SPELL-CHECK
```javascript
function spellCheckGeneral(text) {
  const generalCorrections = {
    // Common typos
    'recieve': 'receive', 'recive': 'receive',
    'occured': 'occurred', 'occurd': 'occurred',
    'begining': 'beginning', 'begginning': 'beginning',
    'untill': 'until', 'till': 'until',
    'thier': 'their', 'ther': 'their',
    'becuase': 'because', 'becase': 'because',
    'woudl': 'would', 'wold': 'would',
    'coudl': 'could', 'cold': 'could',
    'shoudl': 'should', 'shold': 'should',
    'definitly': 'definitely', 'definately': 'definitely'
  };

  let corrected = text;

  Object.keys(generalCorrections).forEach(misspelling => {
    const regex = new RegExp(`\\b${misspelling}\\b`, 'gi');
    corrected = corrected.replace(regex, (match) => {
      // Preserve original capitalization
      if (match[0] === match[0].toUpperCase()) {
        const correction = generalCorrections[misspelling.toLowerCase()];
        return correction.charAt(0).toUpperCase() + correction.slice(1);
      }
      return generalCorrections[misspelling.toLowerCase()];
    });
  });

  return corrected;
}
```

---

## INTEGRATION GUIDE

### Patient Info Collector
- Use `spellCheckName()` for firstName and lastName (lines 144-145)

### Contact Info Collector
- Use `spellCheckEmail()` for email addresses

### Medical Info Collector
- Use `spellCheckMedicalTerms()` for symptoms input
- Use `spellCheckGeneral()` for additional information

### Insurance Collector (if exists)
- Use `spellCheckInsurance()` for insurance provider names
- Use `spellCheckName()` for policy holder names

---

## USAGE EXAMPLE

```javascript
// In Patient Info Collector - Name Collection
case 'waiting_for_name':
  if (validateFullName(message)) {
    const nameMatch = message.match(/^([A-Za-z]+)[\s]+([A-Za-z]+)$/);
    const firstName = spellCheckName(nameMatch[1]); // AUTO-CORRECTS TYPOS
    const lastName = spellCheckName(nameMatch[2]);  // AUTO-CORRECTS TYPOS

    collectedData.firstName = firstName;
    collectedData.lastName = lastName;
    ...
  }
  break;

// In Contact Info Collector - Email Collection
case 'waiting_for_email':
  if (validateEmail(message)) {
    const correctedEmail = spellCheckEmail(message); // AUTO-CORRECTS DOMAIN TYPOS
    collectedData.email = correctedEmail;
    ...
  }
  break;

// In Medical Info Collector - Symptoms Collection
case 'waiting_for_symptoms':
  const correctedSymptoms = spellCheckMedicalTerms(message); // AUTO-CORRECTS MEDICAL TERMS
  collectedData.symptoms = correctedSymptoms;
  ...
  break;
```

---

## NOTES

- These functions are NON-INVASIVE - they only correct known typos
- Unknown words are left unchanged
- Functions preserve capitalization where appropriate
- Can be easily expanded with more corrections as needed
- Should be integrated into N8N workflow nodes through the UI
