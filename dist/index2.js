import{g as v,r as s,C as D}from"./index.js";const C=()=>{const n=document.querySelector("[data-checkout-order-details]"),e=document.querySelector(".checkout__order-list"),r=v(),a=new MutationObserver(c);o(r),window.addEventListener("message",i),a.observe(e,{childList:!0});function u(t){if(!n)return;const d=Object.entries(t).map(([l,m])=>{const p=m.map(S=>Object.entries(S).map(([g,f])=>`${g}: ${f.value}`).join(`
`));return`SKU ${l}:
${p.join(`

`)}`}).join(`

`);n.value=d}function c(){s(e,r)}function o(t){s(e,t),u(t)}function i(t){t.data.type===D&&o(t.data.payload)}return()=>{window.removeEventListener("message",i),a.disconnect()}};export{C as usePageScripts};
