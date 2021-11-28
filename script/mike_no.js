function mikeKey(mike_key,mike_time,username) {
    var KeyOperation = mike_key+mike_time+username;
    var signature = api.require('signature');
    var mikeKey = signature.md5Sync({
        data: KeyOperation,
        uppercase: false
    });
    return mikeKey
}

function mikeNowTime() {
    var timeDtae=Date.parse(new Date());
    return timeDtae/1000;
}

//搜索设备
function browse() {
    api.showProgress({
        title: '搜索设备中……',
        text: '请稍等...',
        modal: true
    });
    //var param = {browseType:1};
    var param = {
        browseType: 0
    };
    leCastDemo.browse(param, function(ret, err) {
        if (ret.result == '1') {
            //alert(JSON.stringify(ret));
            console.log(JSON.stringify(ret));
            var arr = [];
            var deviceList = ret.deviceList;
            for (var i = 0; i < ret.deviceList.length; i++) {
                arr.push(ret.deviceList[i]["name"]);
            }
            console.log('Arr='+arr);
            if(arr.length > 0){
                api.actionSheet({
                    title: '请选择接收设备',
                    cancelTitle: '取消',
                    buttons: arr
                }, function(ret, err) {
                    var index = ret.buttonIndex;
                    uid1 = deviceList[index - 1]['ip'];
                    stopBrowse();//停止搜索方法
                    connect();//链接设备
                });
            }else {

                api.hideProgress();
                api.toast({
                    msg: '未搜索到其他设备',
                    duration: 1000
                });
            }
            api.hideProgress();
        }


    });
}
//停止搜索附近的接收端设备
/*
  因为browse方法会不停的搜索，所以要在适当的时候调用stopBrowse方法
  返回字段说明：
      {result:1
      }
  */
function stopBrowse() {
    leCastDemo.stopBrowse(function(ret, err) {
        //alert(JSON.stringify(ret));
    });
}
//通过uid连接,在browse回调中获取搜索到的uid
function connect() {
    //var param = {serviceInfoUid: uid1}; //传入uid  1474652758755455217
    var param = {serviceInfoIp:uid1};//传入Ip
    leCastDemo.connect(param, function(ret, err) {
        //alert(JSON.stringify(ret));
        if (ret) {
            stopBrowse();
            //startMirror();
            play();
        }
    });
}
//播放媒体
function play() {
    //var wd = $api.val($api.byId('url1'));
    //console.log(wd);
    var param = {
        directPlay: 0, //是否直接播放，1无需连接设备直接播放(但需要先搜索)，0需连接设备(默认)
        connectedUid: uid1, //直接播放的设备的uid(需要先搜索获取)，directPlay为1时该字段必须要传
        screenCode: "", //有些屏幕需要投屏码的就要传，可选项
        mediaType: 2, //媒体类型：数字型，1音乐,2视频，3图片
        localUrl: "", //本地媒体路径，支持widget://,fs://,安卓系统标准文件路径
        netUrl: TVURL, //网络文件路径,http://...
        //这两个url必须要传一个，两个都传时只认localUrl
    };
    leCastDemo.play(param, function(ret, err) {
        if (ret.status != 25) { //播放进度已更新不弹窗，避免弹窗过多
            //alert(JSON.stringify(ret));
            //var msg = JSON.stringify(ret.msg);
            api.toast({
                msg: '开始播放',
                duration: 1000
            });
            var dlna = $api.byId('dlna');
            dlna.style = "display:none";
        }
    });
}