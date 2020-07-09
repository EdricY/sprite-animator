import { getEl } from "./utils";
import { qredraw } from "./main";

const propArr = [ "x", "y", "w", "h", "ax", "ay" ];
const inputArr = propArr.map(prop => getEl("selected-" + prop));

export function bindSelectedBorder(border) {
  if (border == null) {
    inputArr.forEach(input => input.value = input.onchange = null);
    return;
  }

  for(const i in inputArr) {
    const prop = propArr[i];
    inputArr[i].value = border[prop];
    inputArr[i].onchange = () => {border[prop] = Number(inputArr[i].value); qredraw()}
  }
}