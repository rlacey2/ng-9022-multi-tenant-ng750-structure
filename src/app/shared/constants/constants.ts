

// see https://www.jeffryhouser.com/index.cfm/2019/1/22/How-to-access-a-Constant-in-an-Angular-View-Template
// is it worth the refactoring?

import { HttpContextToken } from "@angular/common/http";



// BOOLEAN_OPTIONS ?? follwing guidelines

// techical debt public vs authenicated contants?

// public 

export const BOOLEAN_OPTIONS_YN = [{ // only

  value: false,
  label: 'No'
}, {
  value: true,
  label: 'Yes'
}];

export const BOOLEAN_OPTIONS = [{
  value: null,
  label: 'Choose...'
}, {
  value: false,
  label: 'No'
}, {
  value: true,
  label: 'Yes'
}];

export const BOOLEAN_OPTIONS_BINARY = [{
  value: '',
  label: 'Choose...'
}, {
  value: 0,
  label: 'No'
}, {
  value: 1,
  label: 'Yes'
}];

// technical debit refactor public vs admin some in ECT3CurrentService

export const EMAILS_DIFFERENT = "Email verification issue";
export const UNSAVED_CHANGES = "Unsaved changes will be lost"; // used by alert dialog when form is dirty and routing away

// passwords are for admin users while not authenicated
export const PASSWORD_CONSTRAINTS = "Strong => 8 characters,min 1 uppercase, min 1 lowercase, min 1 digit and one special character"
export const PASSWORD_MISMATCH = "Passwords don't match, please correct"
export const PASSWORD_REQUIRED = "Password is required"
export const PASSWORD_CONFIRMATION_REQUIRED = "Confirmation required"
export const SUBMIT_DISABLED = "Submit disabled Draft/Preview"


export const BLOCKING_FULL_SCREEN_DIALOG_OPTIONS = {
  // minWidth: '96%',    // blockingFullScreenDialogOptions 20240626 changed this, now centres
  // minHeight: '96%', 
  // height: '96%', // otherwise some admin type dialogs collapse to meet the data
  // width: '96%',
  // height: '100vh',
  height: '100dvh', // 20260102 mobile
  width: '100vw',
  maxWidth: '100vw',
 
  disableClose: true
}

// authenticted ???

export const AREA_JUSTIFY_TOOLTIP = "If alone on a row due to device size"
export const NO_DATA_AVAILABLE = "No Live Data Main View"
export const DATA_HIDDEN = "Data Hidden"
export const DAYS_SINCE = "Days Idle"
export const DAY_SINCE = "Day Idle"

export const NO_UNDO_AVAILABLE = "<br>There is no undo available, be careful:<br><br>Are you Sure?";
export const MAY_BREAK_LIVE_DATA = "This may break LIVE DATA selections/reporting<br><br>";
//export const NO_CHOICES_AFTER_SAVE = "No Choices on Save";
export const NO_CHOICES_AFTER_SAVE = "Not Public";   // = not formMeta0.liveAfterSave
export const PUBLIC_ACCESS_AFTER_SAVE = "Will Be Public"; // = formMeta0.liveAfterSave

export const NO_PUBLIC_ACCESS = "Not Public";  // not formMeta0.publicCanSubmitNow
export const PUBLIC_ACCESS_NOW = "Public Now";  // formMeta0.publicCanSubmitNow
export const NOT_ON_STATUS_VIEW = "Not on Status view";
export const ZERO_CHOICES = "ZERO Choices";         // cms 10 no choices     

export const STATUS_OVERRIDE = "Status Override"; // status override Enabled

export const FIX_CONFIGURATION = "Unsaved, building";

export const DUPLICATION_WARNING_FIELD_NAME = 'Static Name Internal Adjusted To Avoid Duplication<br><br>Careful with function code referencing input';
export const WARN_FIELD_SWAP = "Check all new settings and preview test<br><br>Delete and redo if necessary";
export const WARN_BUSINESS_CONSEQUENCES = "Verify outcome: refund/charge";

export const APPLY_MIN_THEME = "Various settings will change<br>one attendee allowed, change if necessary<br>Min = 1 and Max = 1 in cms09<br><br>Check the preview";

export const UNUSEABLE_AFTER_CHANGE = "Code unuseable after change"

//20240617
export const STATICNAME_RULES = `[Static Name Internal] is case sensitive, any changes after release to the public may break \
                                the binding to the existing data and 'onChange code'. [Static Name Internal] is used on \
                                reports. Typically set [Display Static Name] to 'No' and use [Public Label] to present user friendly public text version.`
// https://regex101.com/

/*
//  https://www.concretepage.com/angular-2/angular-2-4-pattern-validation-example#Template-driven
  unamePattern = "^[a-z0-9_-]{8,15}$";
  pwdPattern = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,12}$";
  mobnumPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
*/

//    no  / at start or end

// https://digitalfortress.tech/tips/top-15-commonly-used-regex/
// https://regexr.com/
// https://regex101.com/ 

// STRING VERSIONS NEEDED TO SAVE TO DATABASE ETC and need a \ before normal pattern to behave

export const NOT_EMPTY_PATTERN = /^(?!\s*$).+/;
export const NOT_EMPTY_PATTERN_STR = '^(?!\\s*$).+';

//   \- needed in next before the -
export const EMAIL_PATTERN = /^[_a-zA-Z0-9\-]+(\.[_a-zA-Z0-9\-]+)*(\+[a-zA-Z0-9\-]+)?@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+){1,}$/i; // allows or xxx+ignore@gmail.com
export const EMAIL_PATTERN_STR = '^[_a-zA-Z0-9-]+(\\.[_a-zA-Z0-9-]+)*(\\+[a-zA-Z0-9-]+)?@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+){1,}$'; // allows or xxx+ignore@gmail.com

// 20250507 multiple email address separated by ; 
// allows or xxx+ignore@gmail.com  ;    xxx+ignore@gmail.com    i.e. spaced
export const EMAIL_PATTERN_N = /(\s*[_a-zA-Z0-9\-]+(\.[_a-zA-Z0-9\-]+)*(\+[a-zA-Z0-9\-]+)?@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+){1,}\s*;*){1,}/i; // 
export const EMAIL_PATTERN_N_STR = '(\\s*[_a-zA-Z0-9\-]+(\\.[_a-zA-Z0-9\-]+)*(\\+[a-zA-Z0-9\\-]+)?@[a-zA-Z0-9\-]+(\\.[a-zA-Z0-9\\-]+){1,}\\s*;*){1,}'; // allows or xxx+ignore@gmail.com

export const TELEPHONE_PATTERN = /^[\+]*[\(]{0,1}[0-9]{1,4}[\)]{0,1}[\-\s\.\/0-9]*$/; // crashing the regex added to -    \- and \\-
export const TELEPHONE_PATTERN_STR = '^[\+]*[\(]{0,1}[0-9]{1,4}[\)]{0,1}[\\-\\s\\.\\/0-9]*$';
// export const TELEPHONE_PATTERN  = "^\s*\(?\s*\d{1,4}\s*\)?\s*[\d\s]{5,10}\s*$"; 

// or [email]="true" directive on the input
//                          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
//  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

export const CURRENCY_PATTERN = /^[1-9]([0-9]{0,5})?(\.[0-9]{2})?$/;   // must start with a 1..9 POSITVE
export const CURRENCY_PATTERN_WITHZERO = /^[0-9]([0-9]{0,5})?(\.[0-9]{2})?$/;  // allows 0 and 0.00
export const CURRENCY_PATTERN_MIN_01_CENT = /^(?=.*[1-9])(0|[1-9]([0-9]{0,5})?)(\.[0-9]{2})?$/;  // >= 0.01 && <= 999999.99 allows 0.xx  but not 0 or 0.00

//export const CURRENCY_PATTERN = '^[0-9]+(\.[0-9]{1,2})?$';
export const INTEGER_POSITIVE_PATTERN = /^[1-9]+[0-9]*$/; // ^[1-9]+\d*$ refused multiples of 10
export const INTEGER_POSITIVE_PATTERN_STR = '^[1-9]+[0-9]*$'; // ^[1-9]+\d*$ refused multiples of 10

// these appear to be better
export const DECIMAL_2_PATTERN = /^\d+\.\d{2}$/  // 0.00
export const DECIMAL_2_PATTERN_STR = '^\\d+\\.\\d{2}$';

// either valid code or null/ empty string  nb ^$ | at start to catch empty string DOES NOT LIKE SPACES with |
// used by a validator
export const HEX_COLOUR_OR_EMPTY_PATTERN = /^$|^#([A-F0-9]{3}){1,2}$|^red$|^white$|^black$|^blue$|^green$|^yellow$|^orange$/i;

export const TIME24_PATTERN = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
export const TIME24_PATTERN_STR = '^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$';

export const TIME12_AM_PM_PATTERN = /^((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))$/
export const TIME12_AM_PM_PATTERN_STR = '^((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))$';

export const STATIC_NAME_PATTERN_STR = "^([A-Za-z]+[0-9]*[ \-\_0-9]*)+[A-Za-z0-9]+$|^[A-Za-z]+$"; // static name, single spaces and - || _ only terminating numbers

export const RANGE_1_10_PATTERN_STR = "^[1-9]{1}$|^10$";

export const RANGE_MINUS_1_10_PATTERN = /(^-1$)|^[1-9]{1}$|^10$/; // tested
export const RANGE_MINUS_1_10_PATTERN_STR = "(^-1$)|^[1-9]{1}$|^10$"; // tested

export const RANGE_1_99_PATTERN_STR = "^(0?[1-9]|[1-9][0-9])$";


// comma separated, prevent leading , and trailing , but allow spaces in terms between commma
export const COMMA_SEPARATED_PHRASES = /^(.+),+(.+)$/     // /^(\w+( +\w+)*,* *)+( *\w+( +\w+)*)$/ // passes: region 1, region 2, region 3 and single case??
export const COMMA_SEPARATED_PHRASES_STR = "^(\.+),+(\.+)$"            // "^(\w+( +\w+)*,* *)+( *\w+( +\w+)*)$"

export const WORD_REQUIRED = /.*\w.*/
 