export function getSys() {
  let sys = "android";
  let u = navigator.userAgent;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if(isiOS){
    sys = "ios";
  }else{
    sys = "android";
  }
  console.log("当前手机"+sys+"系统");
  return sys;
};