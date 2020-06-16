// player = new ChimeeMobilePlayer({
//   // 播放地址
//   src: "https://v1-js.e.99.com/114/video/7903d15b397d4d65bcc698258318e19b/f87cd342781a469381291a9de5c9bc6f.v.854.480/f87cd342781a469381291a9de5c9bc6f.m3u8",
//   // 直播:live 点播：vod
//   // isLive: type == 'live',
//   // 编解码容器
//   // poster: poster,
//   // dom容器
//   wrapper: '#wrapper',
//   // video
//   autoplay: false,
//   controls: true,
//   muted: true,
//   // box: 'native',
//   // disableUA: [
//   //   'Mozilla/5.0 (Linux; Android 4.4.2; HM NOTE 1TD Build/KOT49H; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/62.0.3202.97 Mobile Safari/537.36',
//   // ],
//   // removeInnerPlugins: ['chimeeMobiControlbar', 'chimeeState']
// });

const url = "http://v1-js.e.99.com/28398/video/35141211646846d8ac9aa8ec759ae416/0d22bb0a72b34ff69974c07cde42c3d9.v.640.384.mp4/secret.m3u8"
$.ajax({
  url: url,
  bodyProxy: true,
  headers: []
}).done(function(data){
  var uri = data.match(/URI=".*"/i);
  if (uri) {
    if (_.isEmpty(uri[0])){
      return;
    }

    var baseUrl_1 = uri[0].substring(5, uri[0].length - 1);
    var Ids = uri[0].match(/keys\/.*"/i)[0];
    var resourceId_1 = Ids.substring(5, Ids.length - 1);
    $.ajax({
      url: baseUrl_1 + "/signs"
    }).done(function (data) {
      var nonce = data.nonce;
      if (!nonce) {
        return;
      }

      var sign = CryptoJS.MD5(nonce + resourceId_1)
        .toString()
        .substring(0, 16);
      if (!window.CryptoJS) {
        window.console && window.console.log('请引入CryptoJS库');
        return;
      }
      var _sign = CryptoJS.enc.Utf8.parse(sign);
      var getKeyUrl = baseUrl_1 + "?nonce=" + nonce + "&sign=" + sign;

      var _hlsCustomKey = {}
      _hlsCustomKey.isCustomKey = true;
      _hlsCustomKey.customKeyUrl = getKeyUrl;
      _hlsCustomKey.customSign = _sign;
      _hlsCustomKey.char2buf = function (str) {
        var buf = new ArrayBuffer(str.length);
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
          bufView[i] = str.charCodeAt(i);
        }
        return buf;
      };
      _hlsCustomKey.customDecrypt = function (key, sign) {
        var dec = CryptoJS.AES.decrypt(key, sign, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        });
        return dec.toString(CryptoJS.enc.Utf8);
      };

      new ChimeeMobilePlayer({
        // 播放地址
        src: url,
        // 直播:live 点播：vod
        // isLive: type == 'live',
        // 编解码容器
        // poster: poster,
        // dom容器
        wrapper: '#wrapper',
        // video
        autoplay: false,
        controls: true,
        box: 'hls',
        // muted: true,
        kernels: {
          hls: {
            hlsCustomKey: {
              ..._hlsCustomKey
            }
          }
        },
      });
    })
  } else {
    new ChimeeMobilePlayer({
      // 播放地址
      src: url,
      // 直播:live 点播：vod
      // isLive: type == 'live',
      // 编解码容器
      // poster: poster,
      // dom容器
      wrapper: '#wrapper',
      // video
      autoplay: false,
      controls: true,
      muted: true,
    });
  }
})
