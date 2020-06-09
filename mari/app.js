const $log = document.querySelector('.log > ul');
const $keypad = document.querySelector('.keypad > form');
const $nums = document.querySelector('.enter-nums').children;
const $numBtns = [...$keypad.children].filter($btn => $btn.matches('.input-num'));
const $delBtn = document.querySelector('.del');
const $hitBtn = document.querySelector('.hit');
const $rtBtn = document.querySelector('.retry');

let tryNum = [];
const tryList = [3, 4, 5];
let Answer = [];
const nowTry = tryList[0];
let inputCount = 0;
let count = 0;
let result = [
  // { id: 1, content: [0, 1, 2], strikeC: 0, ballC: 0 }
];
let btnStatus = 0;

const resetTryNum = () => {
  tryNum = Array(nowTry).fill('-');
};
const renderInput = () => {
  // console.log($nums[0].textContent);
  tryNum.forEach((_, i) => $nums[i].textContent = tryNum[i]);
  $delBtn.disabled = !(typeof tryNum[0] === 'number');
  $hitBtn.disabled = !(typeof tryNum[nowTry - 1] === 'number');
  // 숫자가 전부 입력되면 숫자버튼 비활성화
  btnStatus = $numBtns.filter(({ disabled }) => disabled).length;
  if (btnStatus === nowTry) {
    $numBtns.forEach($btn => $btn.disabled = true);
  } else if (btnStatus > nowTry) {
    $numBtns.forEach($btn => $btn.disabled = false);
  }
};
const createAnswer = () => {
  // 선택한 숫자 개수만큼의 정답 생성
  Answer = Array(nowTry).fill(0);
  const numArr = Array(10).fill().map((_, index) => index);
  Answer = Answer.map(() => numArr.splice(Math.floor(Math.random() * numArr.length), 1)[0]);
  // 확인용
  console.log(Answer);
};

const checkNums = (content = []) => {
  result = [{ id: count + 1, content, strikeC: 0, ballC: 0 }, ...result];
  result[0].content.forEach((num, i) => {
    if (num === Answer[i]) result[0].strikeC++;
    else {
      Answer.forEach(Anum => {
        if (Anum === num) result[0].ballC++;
      });
    }
  });
  // console.log(count, result[0].content, result[0].strikeC, result[0].ballC);
};
const renderLog = () => {
  let html = '';
  result.forEach(log => html += `<li class="log-item"><span class="result">
<span class="try">${log.content.join('')}</span>
<span class="strike">${log.strikeC}</span><span class="ball">${log.ballC}</span>
</span>`);
  $log.innerHTML = html;
  inputCount = 0;
  count++;
  resetTryNum();
  renderInput();
};


const toggleClass = () => {
  $log.classList.toggle('active');
  $keypad.parentNode.classList.toggle('active');
  $log.nextElementSibling.classList.toggle('active');
  $rtBtn.classList.toggle('active');
};

// 이벤트 핸들러
window.onload = () => {
  resetTryNum();
  createAnswer();
  renderInput();
  toggleClass();
};
$keypad.onclick = ({ target }) => {
  if (!target.matches('form > button')) return;
  // 숫자입력시
  if (target.textContent.length === 1) {
    tryNum[inputCount] = +target.textContent;
    inputCount++;
    target.disabled = true;
  }
  renderInput();
};
$hitBtn.onclick = () => {
  checkNums([...$nums].map($num => +$num.textContent));
  result[count].strikeC === nowTry ? toggleClass() : renderLog();
};
$rtBtn.onclick = window.onload;
