const e="loaded",t=()=>sessionStorage.getItem(e)==="true",s=()=>sessionStorage.setItem(e,"true"),o=()=>{t()};export{t as isLoaded,s as setIsLoaded,o as useInitialScript};
