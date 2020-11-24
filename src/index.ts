import "../public/style.scss";

const LOGGER_ID = "logger";
const MAGIC_NUMBER = 100;
const BOARD_ID = "board";
const RESET_BUTTON_ID = "reset";
const GAME_MAIN_ID = "gameMain";
const FIRST_NODE_ICON = "🦧";
const SECOND_NODE_ICON = "🐷";
const INIT_NODE_ICON = "🐑";
const DIALOG_WRAP_ID = "dialogWrap";
const RESULT_TEXT_ID = "result";
const CURR_NODE_TEXT_ID = "currNodeText";

function getLogger(id: string) {
  let logList: any;
  if (!logList) logList = document.getElementById(id) as HTMLElement;
  return function logger(currNode: any, position: any) {
    logList.innerHTML += `<li>${currNode}--row-${position.row}--column-${position.col}`;
  };
}
/**
 * 使用数字存储位置，方便使用set对比 */
function getPositionNum(N: number, index: number) {
  return (~~(index / N) + 1) * MAGIC_NUMBER + (index % N) + 1;
}
// logger需要打印行和列，所以使用这个实现
function numToPosition(num: number) {
  return {
    row: parseInt((num / MAGIC_NUMBER) as any),
    col: num % MAGIC_NUMBER,
  };
}
/** 判断是否五子连珠 */
function isWin(N: number, set: Set<number>, positionNum: number) {
  function common(stepLength: number) {
    let count = 0;
    let temp = positionNum - stepLength;
    while (set.has(temp)) {
      ++count;
      temp -= stepLength;
    }
    temp = positionNum + stepLength;
    while (set.has(temp)) {
      ++count;
      temp += stepLength;
    }
    return count >= 4;
  }
  function judgeRow() {
    return common(1);
  }
  function judgeCol() {
    return common(100);
  }
  // 撇
  function judgeLeftSlash() {
    return common(101);
  }
  // 捺
  function judgeRightSlash() {
    return common(99);
  }
  let flag = judgeRow() || judgeCol() || judgeLeftSlash() || judgeRightSlash();
  return flag;
}
function isButton(el: HTMLElement) {
  return el.tagName.toLowerCase() === "button";
}
function main() {
  const N = 15;
  const board = document.getElementById(BOARD_ID);
  const main = document.getElementById(GAME_MAIN_ID);
  const result = document.getElementById(RESULT_TEXT_ID);
  const currNodeText = document.getElementById(CURR_NODE_TEXT_ID);
  const dialogWrap = document.getElementById(DIALOG_WRAP_ID);
  const resetButton = document.getElementById(RESET_BUTTON_ID);
  let isFirst = true;
  let firstList = new Set();
  let secondList = new Set();
  const logger = getLogger(LOGGER_ID);
  document.body.onload = () => {
    currNodeText!.innerText = "现在轮到" + FIRST_NODE_ICON + " 行动了";
  };
  // TODO: 将reset抽象到onload函数
  resetButton!.addEventListener("click", () => {
    console.log("reset");
    const nodes = document.getElementsByClassName("node");
    isFirst = true;
    firstList = new Set();
    secondList = new Set();
    for (const node of nodes) {
      (node as HTMLInputElement).innerText = INIT_NODE_ICON;
      (node as HTMLInputElement).disabled = false;
    }
    const logList = document.getElementById(LOGGER_ID);
    logList!.innerHTML = "";
    main!.classList.remove("blur");
    dialogWrap!.hidden = true;
  });
  // 事件委托
  board!.addEventListener("click", function boardOnClick(e) {
    const target = e.target as HTMLElement;
    if (!isButton(target)) {
      return;
    }
    const index = (target as any).id;
    const positionNum = getPositionNum(N, index);
    const position = numToPosition(positionNum);
    (target as any).disabled = true;
    const [currList, currNode, nextNode] = isFirst
      ? [firstList, FIRST_NODE_ICON, SECOND_NODE_ICON]
      : [secondList, SECOND_NODE_ICON, FIRST_NODE_ICON];
    logger(currNode, position);
    currList.add(positionNum);
    (target as any).innerText = currNode;
    currNodeText!.innerText = "现在轮到" + nextNode + " 行动了";
    if (isWin(N, currList as any, positionNum)) {
      dialogWrap!.hidden = false;
      main!.classList.add("blur");
      result!.innerText = currNode + "赢了";
      console.log(currNode + "赢了");
    }
    isFirst = !isFirst;
  });
}
main();
