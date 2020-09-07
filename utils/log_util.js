

var logFlag = false;

module.exports.logInfo=function(data){
  if (logFlag){
    console.log(data);
  }
}