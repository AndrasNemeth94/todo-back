//3 alphanumeric chars, 2 numbers, 1 unique char
export const pwRegex = new RegExp(/^[a-zA-Z]{3,3}[0-9]{2,2}[§~?!+%=€|đĐłŁ$ß¤×÷<>#&@{};,:_*-]+$/);
//email reg
export const emailReg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
//JWT regex
export const jwtReg = new RegExp(/^[a-z][\w-]*(?:\.[\w-]+)*$/);