<script setup>
// 网上有很多 根据高度来计算分页的哦 那种可不实用 我这边还是根据 数据 循环来吧
// 其实前端打印的话  不管是生成PDF 还是 直接打印数据量太大 都不好  都很慢 毕竟是DOM 所以数据量大 还是后端生成PDF好

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ref } from "vue";
import imgUrl from '@/assets/logo.png'

const num = ref("");
let flag = false;
const index = ref(1)

const creatPdf = () => {
  if (!num.value) return;
  if (flag) return;
  flag = true;
  const pdfWidth = 70;
  const pageHeight = 75;
  const pdf = new jsPDF("", "mm", [pdfWidth, pageHeight]);
  const blackHole = document.getElementById("blackHole");
  pdf.setProperties({
    title: "title",
    subject: "打印sn标签",
    author: "J",
    keywords: "javascript, web, pdf, print",
    creator: "creator",
  });
  // 如果数据量大 就没必要在渲染dom 浪费内存了 特别复杂的dom 就算了
  // 生成dom
  const fn = () => {
    const boxItem = document.createElement("div");
    boxItem.style.cssText =
      "border:1px solid #000; width: 140mm;height: 150mm;padding: 1mm 2mm;page-break-after: always;page-break-before: always;font-size: 16px";
      console.log(index.value)
    boxItem.innerHTML = getTemplate(index.value);
    // 生成的dom 还是要挂在到页面中去的
    blackHole.appendChild(boxItem);
    // 渲染成 canvas
    html2canvas(boxItem).then((canvas) => {
      const pageData = canvas.toDataURL("image/jpeg", 1);
      pdf.addImage(pageData, "JPEG", 0, 0, pdfWidth, pageHeight);
      //  渲染上去就可以干掉了 节约内存
      blackHole.removeChild(boxItem);
      if (index.value < num.value) {
        pdf.addPage();
        index.value++;
        fn()
      } else {
        flag = false;
        index.value = 1
        const blob = pdf.output("blob");
        var blob_url = URL.createObjectURL(blob);
        document.getElementById("iframeAllBox").src = blob_url;
      }
    });
  }
  fn()
};

// 随便写写吧 生成你想打印的东西
const getTemplate = (index) => {
  return `<img src="${imgUrl}" alt="" /><div>我是打印盒子${index}</div>`;
};
</script>

<template>
  <div>JS生成多页PDF</div>
  <br />
  <br />
  <div>
    <input
      placeholder="不想写dom了, 直接输数字打印吧"
      v-model="num"
      type="number"
      @keyup.enter="creatPdf"
    />
    <button @click="creatPdf">确定</button>
  </div>
  <iframe id="iframeAllBox" src="" frameborder="0"></iframe>
  <!-- 哈哈哈哈哈 我是黑洞 -->
  <div id="blackHole"></div>
</template>

<style>
#blackHole {
  width: 0;
  height: 0;
  overflow: hidden;
}

#iframeAllBox {
  width: 90vw;
  height: 985px;
}
</style>
