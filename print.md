

# JS 实现系统打印的四种方式

## 一. JS 使用 window 的方法直接打印

下面是 window 打印的公共方法封装

```javascript
// 打印类属性、方法定义
/* eslint-disable */
const Print = function (dom, options) {
  if (!(this instanceof Print)) return new Print(dom, options);

  this.options = this.extend(
    {
      noPrint: ".no-print",
    },
    options
  );

  if (typeof dom === "string") {
    this.dom = document.querySelector(dom);
  } else {
    this.isDOM(dom);
    this.dom = this.isDOM(dom) ? dom : dom.$el;
  }

  this.init();
};
Print.prototype = {
  init: function () {
    var content = this.getStyle() + this.getHtml();
    this.writeIframe(content);
  },
  extend: function (obj, obj2) {
    for (var k in obj2) {
      obj[k] = obj2[k];
    }
    return obj;
  },

  getStyle: function () {
    var str = "",
      styles = document.querySelectorAll("style,link");
    for (var i = 0; i < styles.length; i++) {
      str += styles[i].outerHTML;
    }
    str +=
      "<style>" +
      (this.options.noPrint ? this.options.noPrint : ".no-print") +
      "{display:none;}</style>";
    return str;
  },

  getHtml: function () {
    var inputs = document.querySelectorAll("input");
    var textareas = document.querySelectorAll("textarea");
    var selects = document.querySelectorAll("select");

    for (var k = 0; k < inputs.length; k++) {
      if (inputs[k].type == "checkbox" || inputs[k].type == "radio") {
        if (inputs[k].checked == true) {
          inputs[k].setAttribute("checked", "checked");
        } else {
          inputs[k].removeAttribute("checked");
        }
      } else if (inputs[k].type == "text") {
        inputs[k].setAttribute("value", inputs[k].value);
      } else {
        inputs[k].setAttribute("value", inputs[k].value);
      }
    }

    for (var k2 = 0; k2 < textareas.length; k2++) {
      if (textareas[k2].type == "textarea") {
        textareas[k2].innerHTML = textareas[k2].value;
      }
    }

    for (var k3 = 0; k3 < selects.length; k3++) {
      if (selects[k3].type == "select-one") {
        var child = selects[k3].children;
        for (var i in child) {
          if (child[i].tagName == "OPTION") {
            if (child[i].selected == true) {
              child[i].setAttribute("selected", "selected");
            } else {
              child[i].removeAttribute("selected");
            }
          }
        }
      }
    }
    // 包裹要打印的元素
    let outerHTML = this.wrapperRefDom(this.dom).outerHTML;
    return outerHTML;
  },
  // 向父级元素循环，包裹当前需要打印的元素
  // 防止根级别开头的 css 选择器不生效
  wrapperRefDom: function (refDom) {
    let prevDom = null;
    let currDom = refDom;
    // 判断当前元素是否在 body 中，不在文档中则直接返回该节点
    if (!this.isInBody(currDom)) return currDom;

    while (currDom) {
      if (prevDom) {
        let element = currDom.cloneNode(false);
        element.appendChild(prevDom);
        prevDom = element;
      } else {
        prevDom = currDom.cloneNode(true);
      }
      currDom = currDom.parentElement;
    }
    return prevDom;
  },

  writeIframe: function (content) {
    var w,
      doc,
      iframe = document.createElement("iframe"),
      f = document.body.appendChild(iframe);
    iframe.id = "myIframe";
    //iframe.style = "position:absolute;width:0;height:0;top:-10px;left:-10px;";
    iframe.setAttribute(
      "style",
      "position:absolute;width:0;height:0;top:-10px;left:-10px;"
    );
    w = f.contentWindow || f.contentDocument;
    doc = f.contentDocument || f.contentWindow.document;
    doc.open();
    doc.write(content);
    doc.close();
    var _this = this;
    iframe.onload = function () {
      _this.toPrint(w);
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 100);
    };
  },

  toPrint: function (frameWindow) {
    try {
      setTimeout(function () {
        frameWindow.focus();
        try {
          if (!frameWindow.document.execCommand("print", false, null)) {
            frameWindow.print();
          }
        } catch (e) {
          frameWindow.print();
        }
        frameWindow.close();
      }, 10);
    } catch (err) {
      console.log("err", err);
    }
  },
  // 检查一个元素是否是 body 元素的后代元素且非 body 元素本身
  isInBody: function (node) {
    return node === document.body ? false : document.body.contains(node);
  },
  isDOM:
    typeof HTMLElement === "object"
      ? function (obj) {
          return obj instanceof HTMLElement;
        }
      : function (obj) {
          return (
            obj &&
            typeof obj === "object" &&
            obj.nodeType === 1 &&
            typeof obj.nodeName === "string"
          );
        },
};
export default Print;
```

1. 使用 window 的方法单个打印

```javascript
<script  setup>
  // vue3.0写法
  import  Print  from  "@/utils/print.js";
  const  printBtn = () => {
   const  printBox = document.getElementById("printBox");
   Print(printBox);
  };
</script>
<template>
 <div  id="printBox">
   <div class="content">
     <img  src="@/assets/logo.png"  alt=""  />
     <div>我是打印盒子</div>
   </div>
 </div>
 <button @click="printBtn">打印</button>
</template>
<style>
.content {
 background: #e73535;
}
/* 解决背景色打印不出来得问题 */
@media  print {
 .content {
   background: #e73535;
   -webkit-print-color-adjust: exact;
  }
}
</style>
```

2. 分页打印

```javascript
<script setup>
import { ref, reactive } from "vue";
import Print from "@/utils/print.js";

const printListBox = ref(null);
const num = ref('');
const list = reactive([]);
const creatDom = () => {
  list.splice(0);
  if (!num.value) return;
  for (let i = 1; i <= num.value; i++) {
    list.push(i);
  }
};
const printBtn = () => {
  Print(printListBox.value);
};
</script>
<template>
  <div>使用window打印的方法 实现分页打印</div>
  <div>
    <input
      type="number"
      v-model="num"
      @keyup.enter="creatDom"
      placeholder="请输入你想生成的数量"
    />
    <button @click="creatDom">确定</button>
  </div>
  <br />
  <button v-show="list.length > 0" @click="printBtn">打印</button>
  <br />
  <br />

  <div class="list" ref="printListBox">
    <div class="content" v-for="item in list" :key="item">
      <img src="@/assets/logo.png" alt="" />
      <div>我是打印盒子{{ item }}</div>
      <!-- 在你需要分页的位置加上 -->
      <div style="page-break-after: always"></div>
    </div>
  </div>
</template>

<style>
.content {
  background: #e73535;
  color: #fff;
  margin-bottom: 20px;
}
/* 解决背景色打印不出来得问题 */
@media print {
  .content {
    background: #e73535;
    color: #fff;
    margin-bottom: 20px;
    -webkit-print-color-adjust: exact;
  }
}
</style>
```

**总结： 核心是第一个代码块中的打印方法封装 传入一个你要打印的 DOM 即可**

## 二. JS 生成 PDF web 渲染 PDF 在 PDF 中打印

- 首先要引入 `html2canvas `和 `jspdf`
  ```
  // 将页面 html 转换成图片
  npm install html2canvas --save
  // 将图片生成 pdf
  npm install jspdf --save
  ```
- 其次看下方代码

```
<script setup>
import html2Canvas from "html2canvas";
import JsPDF from "jspdf";
import { ref } from "vue";
const box = ref(null);

const createPdf = () => {
  /**
   * JsPDF参数
   * 第一个参数： l：横向  p：纵向
   * 第二个参数：测量单位（"pt"，"mm", "cm", "m", "in" or "px"） 需要啥用啥
   * 第三个参数：可以是下面格式，默认为“a4” 如果您想使用自己的格式，只需将大小作为数字数组传递，例如[595.28, 841.89];
   */
  // 定义一个pdf
  const pdf = new JsPDF("", "px");
  // 设置生成的PDF文档
  pdf.setProperties({
    title: "title",
    subject: "打印sn标签",
    author: "J",
    keywords: "javascript, web, pdf, print",
    creator: "creator",
  });
  // 使用 html2Canvas 画个canvas
  html2Canvas(box.value).then((canvas) => {
    const pageData = canvas.toDataURL("image/jpeg", 1);
    pdf.addImage(pageData, "JPEG", 0, 0);
    const blob = pdf.output("blob");
    var blob_url = URL.createObjectURL(blob);
    document.getElementById("iframeBox").src = blob_url;
  });
};
</script>

<template>
  <div>JS生成PDF</div>
  <br />
  <div>我们先来画一个盒子</div>
  <br />
  <div ref="box">
    <div class="content">
      <img src="@/assets/logo.png" alt="" />
      <div>我是打印盒子</div>
    </div>
  </div>
  <br />
  <div>
    <button @click="createPdf">点击打印试试</button>
  </div>
  <iframe id="iframeBox" src="" frameborder="0" ></iframe>
</template>

<style scoped>
.content {
  width: 841px;
  background: #e73535;
  color: #fff;
}
#iframeBox {
  width: 90vw;
  height: 985px;
}
</style>

```

生成多页PDF的代码和教程以及其他操作就不贴了   有兴趣的马上看最下面的gitHub地址吧  

`https://github.com/552088072/vue3-print-demo`

**总结：前端生成PDF如果数据量少 还好 数据量大的话还是需要后端哦  超过100条 基本上就明显的有等待时间了  更多操作还是在github上把我demo下载下来看看**



