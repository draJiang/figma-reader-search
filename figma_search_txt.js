// 创建 UI
let windowEl = ui();

// 创建 UI
function ui() {
  if (document.querySelector(".my_figma_search")) {
    return;
  }

  // 主容器
  let windowEl = document.createElement("div");
  windowEl.classList.add("my_figma_search");
  document.body.appendChild(windowEl);

  // 搜索容器
  let search_box = document.createElement("div");
  search_box.classList.add("search_box");
  windowEl.appendChild(search_box);
  search_box.style = `
  padding: 10px;
  background-color: rgb(98, 49, 239);
  height: 24px;
  position: fixed;
  margin: 10px;
  display: flex;
  justify-content: center;
  `;
  
  // 搜索框
  let search_input = document.createElement("input");
  search_input.classList.add("search_input");
  search_input.style = `
  margin-right: 8px;
  height: 100%;
  padding-left: 4px;
  `;
  search_box.appendChild(search_input);
  
  // 搜索按钮
  let search_btn = document.createElement("button");
  search_btn.style = `
  padding: 0 4px;
  height: 100%;
  `;
  search_box.appendChild(search_btn);

  // 搜索结果
  list = document.createElement("ul");
  list.classList.add("result_list");
  list.style = `
  margin: 70px 10px 10px 10px;`

  windowEl.appendChild(list);

  search_btn.innerText = "搜索";
  search_btn.onclick = function () {
    setTimeout(() => {
      let keyword = document.querySelector(".search_input").value;
      figma_serach(keyword);
    }, 100);

    if (document.querySelector(".result_list")) {
      document.querySelector(".result_list").innerHTML = "搜索中…";
    }
  };

  windowEl.style = `position: fixed;
    width: 400px;
    height: 480px;
    background: rgba(29, 25, 37, 0.93);
    
    inset: 0px;
    margin: 80px 100px 10px auto;
    z-index: 111;
    overflow: hidden;
    box-shadow: rgb(20 15 35 / 17%) 0px 2px 4px, rgb(17 17 17 / 14%) 0px 10px 23px;
    border-top: 5px solid rgb(98, 49, 239);
    border-radius: 4px;
    color: rgb(238, 232, 255);
    font-family: sans-serif;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: auto;
    font-size: 14px;
    white-space: break-spaces;
    word-break: break-all;
    overflow: auto;`;

  return windowEl;
}

function show_result(result_list) {
  let list;
  if (document.querySelector(".result_list")) {
    list = document.querySelector(".result_list");
  } else {
    list = document.createElement("ul");
    list.classList.add("result_list");
  }

  for (let i = 0; i < result_list.length; i++) {
    let r = document.createElement("li");
    r.innerText = result_list[i]["node"].characters;
    r.style = `border: 1px solid #ccc;
    padding: 4px;
    border-radius: 2px;
    margin-bottom: 0.8rem;
    cursor:pointer;`;

    // 点击定位到对应的图层
    r.onclick = function () {
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

    list.appendChild(r);
    // windowEl.appendChild(list);
  }
}

function figma_serach(keyword) {
  // 清空搜索结果
  if (document.querySelector(".result_list")) {
    document.querySelector(".result_list").innerHTML = "";
  }

  // 获取文档中的所有文本图层
  let all_text_node = figma.root.findAllWithCriteria({ types: ["TEXT"] });
  // 遍历所有文本图层，寻找包含关键字的图层
  for (let i = 0; i < all_text_node.length; i++) {
    if (all_text_node[i].characters.indexOf(keyword) >= 0) {
      console.log(all_text_node[i].characters);
      // 关键字的索引位置
      let index_start = all_text_node[i].characters.indexOf(keyword);
      // 关键字的结束位置
      let index_end = index_start + keyword.length;

      let data_temp = {
        node: all_text_node[i],
        start: index_start,
        end: index_end,
      };
      show_result([data_temp]);
    }
  }
}
