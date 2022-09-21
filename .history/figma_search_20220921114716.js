////////////////////////////
// author: jzl666@gmail.com
// blog: https://blog.dabing.one/
////////////////////////////

// 全局变量
let list_current_index = -1; // 当前选中的搜索结果索引
let result_count = 0; // 搜索结果数量
let result_node_list = [];
let my_timer;

// 创建 UI
let windowEl = ui();

// let test_div = document.createElement("div");
// test_div.innerHTML = '<svg t="1663678930145" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2202" width="14" height="14"><path d="M887.328477 617.152318 533.951458 267.007553c-0.512619-0.512619-1.216181-0.672598-1.759763-1.152533-0.127295-0.127295-0.159978-0.319957-0.287273-0.447252-12.576374-12.416396-32.831716-12.352748-45.280796 0.192662L136.511544 618.944765c-12.447359 12.576374-12.352748 32.800753 0.192662 45.248112 6.239161 6.175514 14.399785 9.280473 22.527725 9.280473 8.224271 0 16.479505-3.168606 22.720387-9.471415L509.792985 333.185325l332.480043 329.407768c6.239161 6.175514 14.368821 9.280473 22.527725 9.280473 8.255235 0 16.479505-3.168606 22.720387-9.471415C899.968499 649.85674 899.872168 629.599677 887.328477 617.152318z" p-id="2203"></path></svg>'
// windowEl.appendChild(test_div);

// 设置样式
if (windowEl.querySelector("style") != true) {
  let my_style = document.createElement("style");
  windowEl.appendChild(my_style);

  my_style.innerHTML = `
  
    ::-webkit-scrollbar{
        width: 6px;
        padding:2px;
        background-color:none;
    }

    ::-webkit-scrollbar-thumb {
      
      background-color:var(--color-scrollbar);
      border-radius: 100px;
    }

    ::-webkit-scrollbar-thumb:hover {
      opacity:0.8;
    }
  
    .search_box {
  
      padding: 10px;
      height: auto;
      position: fixed;
      width: 260px;
      border-bottom: 1px solid var(--color-border, rgba(0, 0, 0, .1));
      background-color: var(--color-bg, #fff);
      border-radius: 4px 4px 0 0;
      z-index: 999;
      display:flex;

    }

    .btn_box {
      display:flex;
      position: absolute;
      right: 4px;
    }

    .btn_box * {
      margin-right:8px;
    }

    .btn_box span{
      line-height: 30px;
      height: 30px;
      font-size: 0.82em;
      color: var(--color-text-fs-secondary, rgba(0, 0, 0, .8));
    }

    .disabled_btn {
      pointer-events:none;
      opacity:0.4;
    }

  
    .search_input {
      margin-right: 8px;
      height: 30px;
      width:110px;
      padding-left: 8px;
      border-radius: 1px;
      font-size: 0.9em;
      background-color: var(--color-bg,#fff);
      color: var(--text-primary, rgba(0, 0, 0, .8));
      border: 1px solid var(--color-border,#e6e6e6);
      box-sizing: border-box;
    }
  
    .search_input:focus {
      border: 1px solid var(--color-bg-brand,#0d99ff);
    }
  
    button {
      padding: 0px 12px;
      height: 30px;
      background-color: var(--color-bg-brand,#0d99ff);
      color: rgb(255, 255, 255);
      border-radius: 4px;
      font-size: 0.9em;
    }

    .result_list {
        overflow: overlay;
        top: 54px;
        bottom: 0px;
        position: absolute;
        width: 100%;
    }

    li {
     
        border-bottom: 1px solid var(--color-border,#e6e6e6);
        border-radius: 2px;
        cursor: pointer;
        font-size: 0.92em;
        padding: 4px 10px;
        line-height: 1.8em;
  
    }
  
    li a {
      display: block;
      padding: 0.6em 4px 0.6em;
    }


    .a_visited {
      opacity:0.5;
    }

    .list_selected {
        border: 1px solid var(--color-text-brand);
        opacity:1;
    }


  
    .close_btn,.nav_btn {
      cursor: pointer;
      width: 24px;
      text-align: center;
      color: var(--color-text, rgba(0, 0, 0, .8));
      line-height: 28px; 
      margin: auto 4px auto 4px;
    }

    button:hover {
      opacity:0.8;
    }

    a:hover {
        opacity:0.7;
    }
  
  
    .info {
        color: var(--color-text-fs-secondary, rgba(0, 0, 0, .8));
        font-size: 0.8em;
        cursor: pointer;
        display: block;
        text-align: center;
        margin: 14px 0px 14px 0px;
        width: fit-content;
        left: 50%;
        position: relative;
        transform: translateX(-50%);
    }

    .info:hover {
        text-decoration:underline;
    }
  
  `;
}

// 判断是否在 Figma 文件中打开
console.log(window.location.href);
if (window.location.href.indexOf("figma.com") < 0) {
  // 提示到 Figma 中打开
  if (document.querySelector(".msg_box")) {
    document.querySelector(".msg_box").innerHTML = "⚠️ Please open it in Figma file ⚠️";
  }
}

// 忽略隐藏的图层
figma.skipInvisibleInstanceChildren = true;

// 创建 UI
function ui() {
  if (document.querySelector(".my_figma_search")) {
    return;
  }

  // 主容器
  let windowEl = document.createElement("div");
  windowEl.classList.add("my_figma_search");
  // 添加后滚动列表将不被画布截获
  windowEl.classList.add("js-fullscreen-prevent-event-capture");
  document.body.appendChild(windowEl);

  windowEl.style = `
    position: fixed;
      width: 280px;
      height: 60%;
      max-height: 800px;
      min-height: 400px;

      background-color: var(--color-bg, #fff);

      inset: 0px;
      margin: 52px 244px 10px auto;
      z-index: 111;
      overflow: hidden;
      box-shadow: rgb(20 15 35 / 17%) 0px 2px 4px, rgb(17 17 17 / 14%) 0px 10px 23px;

      border-radius: 4px;
      color: var(--text-primary);
      font-family: sans-serif;

      box-sizing: border-box;
      overflow-y: auto;
      font-size: 14px;
      white-space: break-spaces;
      word-break: break-all;
      overflow: auto;
      background-color: var(--color-bg);`;

  // 搜索容器
  let search_box = document.createElement("div");
  search_box.classList.add("search_box");
  windowEl.appendChild(search_box);

  // 搜索框
  let search_input = document.createElement("input");
  search_input.classList.add("search_input");
  // search_input.placeholder = "Enter a keyword";

  setTimeout(() => {
    document.querySelector(".search_input").focus();
  }, 100);

  search_input.onkeydown = function (e) {
    onInputEnter(e);
  };

  search_input.oninput = function (e) {
    onSearchInputChange(e);
  };

  search_box.appendChild(search_input);

  // 搜索按钮
  let search_btn = document.createElement("button");
  // search_box.appendChild(search_btn);
  // 搜索按钮点击
  search_btn.onclick = function () {
    setTimeout(() => {
      let keyword = document.querySelector(".search_input").value;

      // 如果关键字为空，则忽略
      if (keyword != "") {
        figma_serach(keyword);
      }
    }, 100);
  };

  // 次要按钮容器
  let btn_box = document.createElement("div");
  btn_box.classList.add("btn_box");
  search_box.appendChild(btn_box);

  // 搜索结果数量
  let index_and_count = document.createElement("span");
  index_and_count.classList.add("index_and_count");
  index_and_count.innerText = "";
  btn_box.appendChild(index_and_count);

  // 搜索结果导航按钮 - 上一个
  let pre_btn = document.createElement("a");

  pre_btn.classList.add("nav_btn");
  pre_btn.classList.add("pre_btn");
  pre_btn.classList.add("disabled_btn");

  pre_btn.innerHTML =
    '<svg t="1663692144197" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2173" width="20" height="20"><path d="M745.376 662.624L512 429.248l-233.376 233.376-45.248-45.248L512 338.752l278.624 278.624z" fill="#181818" p-id="2174"></path></svg>';
  btn_box.appendChild(pre_btn);
  // 搜索按钮点击
  pre_btn.onclick = function () {
    // 设置搜索结果获取焦点
    // let result_node_list = document.getElementsByClassName("link_item");

    if (list_current_index <= 0) {
      // 选中最后 1 个搜索结果
      list_current_index = result_count;
    }

    console.log(list_current_index - 1);
    result_node_list[list_current_index - 1].click();
  };

  // 搜索结果导航按钮 - 下一个
  let next_btn = document.createElement("a");

  next_btn.classList.add("nav_btn");
  next_btn.classList.add("next_btn");
  next_btn.classList.add("disabled_btn");

  next_btn.innerHTML =
    '<svg t="1663692104684" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2019" width="20" height="20"><path d="M512 685.248l-278.624-278.624 45.248-45.248L512 594.752l233.376-233.376 45.248 45.248z" fill="#181818" p-id="2020"></path></svg>';
  btn_box.appendChild(next_btn);
  // 搜索按钮点击
  next_btn.onclick = function () {
    next_result();
  };

  // 关闭按钮
  let close = document.createElement("a");
  close.innerHTML =
    '<svg t="1663692441621" class="icon" viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7983" width="18" height="18"><path d="M282.517333 213.376l-45.354666 45.162667L489.472 512 237.162667 765.461333l45.354666 45.162667L534.613333 557.354667l252.096 253.269333 45.354667-45.162667-252.288-253.44 252.288-253.482666-45.354667-45.162667L534.613333 466.624l-252.096-253.226667z" p-id="7984"></path></svg>';
  close.classList.add("close_btn");
  btn_box.appendChild(close);

  close.onclick = function () {
    windowEl.parentNode.removeChild(windowEl);
  };

  // 提示信息
  let msg = document.createElement("div");
  msg.classList.add("msg_box");
  msg.style = `
    margin: 68px 10px 10px;
    `;
  windowEl.appendChild(msg);

  // 搜索结果
  list = document.createElement("ul");
  list.classList.add("result_list");

  windowEl.appendChild(list);

  search_btn.innerText = "Find";

  return windowEl;
}

// 显示搜索结果
function show_result(result_list) {
  // 隐藏提示信息
  if (document.querySelector(".msg_box") && document.querySelector(".msg_box").innerHTML != "") {
    document.querySelector(".msg_box").innerHTML = "";
  }

  let list;
  if (document.querySelector(".result_list")) {
    list = document.querySelector(".result_list");
  } else {
    list = document.createElement("ul");
    list.classList.add("result_list");
  }

  for (let i = 0; i < result_list.length; i++) {
    let r = document.createElement("li");
    let list_link = document.createElement("a");
    list_link.classList.add("link_item");
    // 设置自定义属性，标记当前元素的 index
    list_link.setAttribute("index", result_count - 1);

    // 关键字高亮
    let r_str = result_list[i]["node"].characters;
    const Reg = new RegExp("(" + result_list[i]["keyword"] + ")", "gi");
    r_str = r_str.replace(Reg, `<span style="color: var(--color-text-brand,#0d99ff);font-weight: bold;">$1</span>`);

    list_link.innerHTML = r_str;

    // 点击定位到对应的图层
    list_link.onclick = function (e) {
      console.log(e);
      console.log(e.path[1]);
      // console.log(e.target.getAttribute("index"));

      // 设置当前选中的位置
      list_current_index = new Number(e.target.getAttribute("index"));

      // 点击对象设置在可视范围内（如果不在可视范围内）
      console.log(e.target.parentElement.getBoundingClientRect());
      let this_top = e.target.parentElement.getBoundingClientRect().top;
      // 如果当前元素距离顶部的位置大于容器高度
      if (this_top > windowEl.clientHeight || this_top < 0) {
        e.target.parentElement.scrollIntoView();
        document.querySelector(".result_list").scrollTop = e.target.offsetTop - 100;
      }

      // 取消旧的选中样式
      let current_seleted = document.querySelector(".list_selected");
      if (current_seleted) {
        current_seleted.classList.remove("list_selected");
      }
      // 当前对象显示选中样式
      e.target.parentElement.classList.add("list_selected");

      // // 如果选中的是第 1 个结果，则禁用「上一个」按钮
      // if (list_current_index <= 0) {
      //     setNavBtnDisabled('.pre_btn');
      // } else {
      //     setNavBtnEnable('.pre_btn');
      // }

      // // 如果选中的是最后 1 个结果，则禁用「下一个」按钮
      // if (list_current_index >= result_count - 1) {
      //     setNavBtnDisabled('.next_btn');
      // } else {
      //     setNavBtnEnable('.next_btn');
      // }

      // 设置导航信息
      document.querySelector(".index_and_count").innerHTML = list_current_index + 1 + "/" + result_count.toString();

      // 设置已访问样式
      e.target.parentElement.classList.add("a_visited");

      // 搜索结果是否在当前页面
      // 当前页面 ID
      let this_page_id = figma.currentPage.id;

      // 目标图层所在的页面 ID
      let this_node_parent_page_id = "";

      let p = result_list[i]["node"].parent;
      while (true) {
        if (p.type == "DOCUMENT") {
          break;
        }

        if (p.type == "PAGE") {
          this_node_parent_page_id = p.id;
          break;
        } else {
          p = p.parent;
        }
      }

      if (this_node_parent_page_id != "" && this_page_id != this_node_parent_page_id) {
        // 点击对象不在当前页面，跳转到对应页面
        let document_children = figma.root.children;
        let document_children_length = document_children.length;

        for (let index = document_children_length - 1; index > -1; index--) {
          if (document_children[index]["id"] == this_node_parent_page_id) {
            figma.currentPage = document_children[index];
            break;
          }
        }
      }

      // Figma 视图定位到对应图层
      figma.viewport.scrollAndZoomIntoView([result_list[i]["node"]]);
      // 选中图层
      figma.currentPage.selectedTextRange = {
        node: result_list[i]["node"],
        start: result_list[i]["start"],
        end: result_list[i]["end"],
      };
    };
    r.appendChild(list_link);
    list.appendChild(r);
    // windowEl.appendChild(list);
  }

  // 记录当前生成了多少个节点
  result_node_list = document.getElementsByClassName("link_item");
}

// 搜索
function figma_serach(keyword) {
  // 如果关键字为空，则忽略
  if (keyword == "") {
    return;
  }

  // 提示正在搜索中
  if (document.querySelector(".msg_box")) {
    document.querySelector(".msg_box").innerHTML = "Loading…";
  }
  // 清空搜索结果
  document.querySelector(".result_list").innerHTML = "";
  // 重置搜索结果数量
  result_count = 0;

  // 获取文档中的所有文本图层
  let all_text_node = figma.root.findAllWithCriteria({ types: ["TEXT"] });
  let result_list = [];

  // 遍历所有文本图层，寻找包含关键字的图层
  const Reg = new RegExp(keyword, "i");

  for (let i = 0; i < all_text_node.length; i++) {
    setTimeout(() => {
      let r = all_text_node[i].characters.match(Reg);

      if (r != null) {
        // console.log(all_text_node[i].characters);

        // 关键字的索引位置
        let index_start = r.index;
        // 关键字的结束位置
        let index_end = index_start + keyword.length;

        let data_temp = {
          node: all_text_node[i],
          start: index_start,
          end: index_end,
          keyword: keyword,
        };
        result_count += 1;
        show_result([data_temp]);
      }
    }, 40);
  }

  // 搜索结束
  setTimeout(() => {
    // 设置导航信息
    document.querySelector(".index_and_count").innerHTML = "0/" + result_count.toString();
    // setNavBtnDisabled('.pre_btn');

    // 没有搜索结果
    if (result_count == 0) {
      document.querySelector(".msg_box").innerHTML = "Not find 🧐";

      // 禁用导航按钮
      setNavBtnDisabled(".nav_btn");

      // 隐藏提示信息
      // if (document.querySelector(".msg_box") && document.querySelector(".msg_box").innerHTML != "") {
      //     document.querySelector(".msg_box").innerHTML = "";
      // }
    } else {
      // 有搜索结果

      // 设置导航按钮可用
      setNavBtnEnable(".nav_btn");

      // 设置页脚信息
      let mail = document.createElement("a");
      mail.innerText = "about";
      mail.href = "https://km.netease.com/team/km_cfuncenter/article/445183";
      mail.target = "_blank";
      mail.classList.add("info");
      document.querySelector(".result_list").appendChild(mail);

      // document.querySelector(".result_list").innerHTML += '<p style="color: var(--color-text-fs-secondary);font-size:0.8rem;">jzlong666@gmail.com</p>'
    }
  }, 100);
}

// 监听输入框敲击回车
function onInputEnter(e) {
  // 监听回车键
  if (e.keyCode == 13) {
    // let keyword = document.querySelector(".search_input").value;
    // figma_serach(keyword);
    next_result()
  }
}

// 搜索框值变化事件
function onSearchInputChange(e) {
  console.log(my_timer);

  if (my_timer) {
    console.log("clearTimeout");
    clearTimeout(my_timer);
  }

  my_timer = setTimeout(() => {
    console.log("!!!!setTimeout search");
    let keyword = document.querySelector(".search_input").value;
    figma_serach(keyword);
  }, 500);
}

function setNavBtnDisabled(class_name) {
  let nav_btn = document.querySelectorAll(class_name);
  nav_btn.forEach((btn) => {
    btn.classList.add("disabled_btn");
  });
}

function setNavBtnEnable(class_name) {
  let nav_btn = document.querySelectorAll(class_name);
  nav_btn.forEach((btn) => {
    btn.classList.remove("disabled_btn");
  });
}

// 导航到下一个搜索结果
function next_result() {
  // 设置搜索结果获取焦点
  // let r_list = document.getElementsByClassName("link_item");

  if (list_current_index + 1 >= result_node_list.length) {
    // 选中第 1 个结果
    list_current_index = -1;
  }

  console.log(list_current_index + 1);
  result_node_list[list_current_index + 1].click();
}
