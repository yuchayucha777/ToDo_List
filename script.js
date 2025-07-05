"use strict";
const storage = localStorage;

const table = document.querySelector("table"); // 表
const todo = document.getElementById("todo"); // TODO
const priority = document.querySelector("select"); // 優先度
const deadline = document.querySelector('input[type="date"]'); // 締切
const submit = document.getElementById("submit"); // 登録ボタン

let list = []; // TODOリストのデータ

document.addEventListener("DOMContentLoaded", () => {
  // 1. ストレージデータ（JSON）の読み込み
  const json = storage.todoList;
  if (json == undefined) {
    return; // ストレージデータがない場合は何もしない
  }

  // 2. JSONをオブジェクトの配列に変換して配列listに代入
  list = JSON.parse(json);
  for (const item of list) {
    addItem(item);
  }
});

const addItem = (item) => {
  const tr = document.createElement("tr");

  for (const prop in item) {
    const td = document.createElement("td");
    if (prop == "done") {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item[prop];
      td.appendChild(checkbox);
    } else {
      td.textContent = item[prop];
    }
    tr.appendChild(td);
  }

  table.append(tr);
};

// TODO登録ボタン
submit.addEventListener("click", () => {
  const item = {}; // 入力値を一時的に格納するオブジェクト

  if (todo.value != "") {
    item.todo = todo.value;
  } else {
    window.alert("やることを入力してください");
    return;
  }

  item.priority = priority.value;

  if (deadline.value != "") {
    item.deadline = deadline.value;
  } else {
    const date = new Date(); // 本日の日付情報を取得
    item.deadline = date.toLocaleDateString(); // 日付の体裁を変更
  }

  item.done = false; // 完了はひとまずBoolean値で設定

  // フォームをリセット
  todo.value = "";
  priority.value = "普";
  deadline.value = "";

  addItem(item);

  /*const tr = document.createElement('tr');   // tr要素を生成

// オブジェクトの繰り返しはfor-in文
for (const prop in item) {
  const td = document.createElement('td'); // td要素を生成
  if (prop == 'done') { // 完了欄の場合
    const checkbox = document.createElement('input');  // 要素生成
    checkbox.type = 'checkbox';    // type属性をcheckboxに
    checkbox.checked = item[prop]; // checked属性を設定
    td.appendChild(checkbox);      // td要素の子要素に
  } else {
    td.textContent = item[prop];
  }
  tr.appendChild(td);  // 生成したtd要素をtr要素に追加
}

table.append(tr);  // trエレメントをtable要素に追加
*/

  list.push(item);
  storage.todoList = JSON.stringify(list);
});

const today = new Date();
console.log(today.toLocaleDateString()); // → 詳しい日時表記

const filterButton = document.createElement("button"); // ボタン要素を生成
filterButton.textContent = "優先度（高）で絞り込み";
filterButton.id = "priority"; // CSSでの装飾用
const main = document.querySelector("main");
main.appendChild(filterButton);

filterButton.addEventListener("click", () => {
  const trList = Array.from(document.getElementsByTagName("tr"));
  trList.shift();
  for (const tr of trList) {
    tr.remove();
  }

  for (const item of list) {
    if (item.priority == "高") {
      addItem(item);
    }
  }
});

const clearTable = () => {
  const trList = Array.from(document.getElementsByTagName("tr"));
  trList.shift();
  for (const tr of trList) {
    tr.remove();
  }
};

const remove = document.createElement("button");
remove.textContent = "完了したTODOを削除する";
remove.id = "remove"; // CSS装飾用
const br = document.createElement("br"); // 改行したい
main.appendChild(br);
main.appendChild(remove);

remove.addEventListener("click", () => {
  clearTable();
  list = list.filter((item) => item.done == false);
  for (const item of list) {
    addItem(item);
  }
  storage.todoList = JSON.stringify(list);
});
