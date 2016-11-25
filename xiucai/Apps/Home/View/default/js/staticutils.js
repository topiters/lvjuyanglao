


var staticConfig = {
	apiBaseUrl : "http://localhost.xiucai.com/BIAnalyticsService/r/service/statistic/" 
};


var resultType = {
	failed : 0,//ʧ��
	success : 1,//�ɹ�
	snInvalid: 4//snУ��ʧ��
};


var getViewState = function(){
	var viewState = window.top.document.getElementById('viewState');
	viewState = (viewState == undefined || viewState == null ? '{"user":{"id":0}, "source":0}' : viewState.value);
	var r = jsonDecode(viewState);
	return r;
};


var viewCount = function (callback){
	var viewState = getViewState();
	var apiUrl = staticConfig.apiBaseUrl + "viewCount";
	var params = {
		url: null,
		host: null,
		referer: null,
		userId: 0,
		source: 0,
		sn: null
	};
	params.userId = viewState.user.id;
	params.source = viewState.source;
	params.sn = getSn();
	params.url = urlEncode(window.location.href.replace(/\\/g,''));
	params.host = window.location.host;
	params.referer = (document.referrer == undefined || document.referrer == null ? '' : document.referrer);
	params.referer = urlEncode(params.referer + '').replace(/%/g, "@");
	if(params.url.indexOf("live.xiucai.com") > -1){
		params.url = "live.xiucai.com";
	}
	if(params.url.indexOf("mid.xiucai.com") > -1){
		params.url = "mid.xiucai.com";
	}
	if(params.host.indexOf("live.xiucai.com") > -1){
		params.host = "live.xiucai.com";
	}
	if(params.referer.indexOf("www.baidu.com") > -1){
		params.referer = "www.baidu.com";
	}else if(params.referer.indexOf("www.sogou.com") > -1){
		params.referer = "www.sogou.com";
	}else if(params.referer.indexOf("m.baidu.com") > -1){
		params.referer = "m.baidu.com";
	}
	//ajaxPost(apiUrl, {params: encodeParams(params)}, callback);
	try{
		$('body').append('<img src="' + (apiUrl + '?params=' + encodeParams(params)) + '" width="0" height="0" style="display: none;" />');
	}
	catch(e){}
};


var viewCountEx = function (userId){
	var apiUrl = staticConfig.apiBaseUrl + "viewCount";
	var params = {
		url: null,
		host: null,
		referer: null,
		userId: 0,
		source: 0,
		sn: null
	};
	params.userId = userId;
	params.source = 0;
	params.sn = getSn();
	params.url = urlEncode(window.location.href.replace(/\\/g,''));
	params.host = window.location.host;
	params.referer = (document.referrer == null ? '' : document.referrer);
	params.referer = urlEncode(params.referer + '').replace(/%/g, "@");
	if(params.url.indexOf("live.xiucai.com") > -1){
		params.url = "live.xiucai.com";
	}
	if(params.url.indexOf("mid.xiucai.com") > -1){
		params.url = "mid.xiucai.com";
	}
	if(params.host.indexOf("live.xiucai.com") > -1){
		params.host = "live.xiucai.com";
	}
	if(params.referer.indexOf("www.baidu.com") > -1){
		params.referer = "www.baidu.com";
	}else if(params.referer.indexOf("www.sogou.com") > -1){
		params.referer = "www.sogou.com";
	}else if(params.referer.indexOf("m.baidu.com") > -1){
		params.referer = "m.baidu.com";
	}
	try{
		$('body').append('<img src="' + (apiUrl + '?params=' + encodeParams(params)) + '" width="0" height="0" style="display: none;" />');
	}
	catch(e){}
};

//
var ajaxGet = function(url, callback){
	$.ajax({
			type : "GET",
			url : url,
			data: {},
			dataType : "text",
			success : callback
		}
	);
};

var ajaxPost = function(url, data ,callback){
	$.ajax({
			type : "POST",
			url : url,
			data: data,
			dataType : "text",
			success : callback
		}
	);
};


var encodeParams = function(obj){
	var r = jsonEncode(obj);
	r = urlEncode(r);
	return r;
};


var decodeParams = function(src){
	var r = urlDecode(src);
	r = jsonDecode(r);
	return r;
};


var urlEncode = function(src){
	return encodeURIComponent(src);
};


var urlDecode = function(src){
	return decodeURIComponent(src);
};


var jsonDecode = function(json){
	return $.parseJSON(json);
};


var jsonEncode = function(obj){
	return $.toJSON(obj);
};


var initStaticConfig = function(config){
	if(config != null){
		staticConfig = config;
	}
};


var checkMonth = function (month){
	var m = month;
	if(month.toString().length == 1){
		m = '0' + month;
	}
	return m;
};


var getDate = function (days){
	var today = new Date();
	today.setTime(today.getTime() + 1000 * 60 * 60 * 24 * days);
	var tYear = today.getFullYear();
	var tMonth = today.getMonth();
	var tDate = today.getDate();
	tMonth = checkMonth(tMonth + 1);
	tDate = checkMonth(tDate);
	return tYear + '-' + tMonth + '-' + tDate;
};


var getDateEx = function (startDate, days){
	var today = parseDate(startDate);
	today.setTime(today.getTime() + 1000 * 60 * 60 * 24 * days);
	var tYear = today.getFullYear();
	var tMonth = today.getMonth();
	var tDate = today.getDate();
	tMonth = checkMonth(tMonth + 1);
	tDate = checkMonth(tDate);
	return tYear + '-' + tMonth + '-' + tDate;
};


var diffDateDays = function(src1, src2){
	var startDate = parseDate(src1);
	var endDate = parseDate(src2);
	var ts = startDate.getTime() - endDate.getTime();
	var r = Math.floor(ts / (24 * 3600 * 1000));
	r = Math.abs(r);
	return r;
};


var diffDateDaysEx = function(src1, src2){
	var startDate = parseDate(src1);
	var endDate = parseDate(src2);
	var ts = startDate.getTime() - endDate.getTime();
	var r = Math.floor(ts / (24 * 3600 * 1000));
	return r;
};


var parseDate = function (src){        
	var r = new Date(Date.parse(src.replace(/-/g, "/")));
	return r;
};


var throwError = function(msg){
	throw msg;
};

var getSn = function (){
	var today = new Date();
	var r = parseInt(today.getTime() / 1000);
	return r;
};


var HashMap = function ()
{

    var size = 0; 

    var entry = new Object();
      

    this.put = function (key, value)
    {
        if(!this.containsKey(key))
        {
            size++;
        }
        entry[key] = value;
    }
      

    this.get = function (key)
    {
        return this.containsKey(key) ? entry[key] : null;
    }
      

    this.remove = function (key)
    {
        if( this.containsKey(key) && (delete entry[key]))  
        {
            size --;  
        }
    }
      

    this.containsKey = function ( key )  
    {  
        return (key in entry);  
    }  
      

    this.containsValue = function (value)
    {
        for(var prop in entry)  
        {
            if(entry[prop] == value)  
            {  
                return true;
            }
        }  
        return false;
    }
	

    this.values = function ()
    {
        var values = new Array();
        for(var prop in entry)
        {
            values.push(entry[prop]);
        }
        return values;
    }
	

    this.keys = function ()  
    {
        var keys = new Array();  
        for(var prop in entry)  
        {
            keys.push(prop);
        }  
        return keys;
    }
	

    this.size = function ()
    {  
        return size;  
    }
	
 
    this.clear = function ()  
    {  
        size = 0;  
        entry = new Object();  
    }
	
};


var md5 = function (string){

	function md5_RotateLeft(lValue, iShiftBits) {
		return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
	}
	function md5_AddUnsigned(lX,lY){
		var lX4,lY4,lX8,lY8,lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
				return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
				if (lResult & 0x40000000) {
						return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				} else {
						return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
				}
		} else {
				return (lResult ^ lX8 ^ lY8);
		}
	}         
	function md5_F(x,y,z){
			return (x & y) | ((~x) & z);
	}
	function md5_G(x,y,z){
			return (x & z) | (y & (~z));
	}
	function md5_H(x,y,z){
			return (x ^ y ^ z);
	}
	function md5_I(x,y,z){
			return (y ^ (x | (~z)));
	}
	function md5_FF(a,b,c,d,x,s,ac){
			a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
			return md5_AddUnsigned(md5_RotateLeft(a, s), b);
	};
	function md5_GG(a,b,c,d,x,s,ac){
			a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
			return md5_AddUnsigned(md5_RotateLeft(a, s), b);
	};
	function md5_HH(a,b,c,d,x,s,ac){
			a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
			return md5_AddUnsigned(md5_RotateLeft(a, s), b);
	};
	function md5_II(a,b,c,d,x,s,ac){
			a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
			return md5_AddUnsigned(md5_RotateLeft(a, s), b);
	};
	function md5_ConvertToWordArray(string) {
			var lWordCount;
			var lMessageLength = string.length;
			var lNumberOfWords_temp1=lMessageLength + 8;
			var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
			var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
			var lWordArray=Array(lNumberOfWords-1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while ( lByteCount < lMessageLength ) {
					lWordCount = (lByteCount-(lByteCount % 4))/4;
					lBytePosition = (lByteCount % 4)*8;
					lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
					lByteCount++;
			}
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
			lWordArray[lNumberOfWords-2] = lMessageLength<<3;
			lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
			return lWordArray;
	};
	function md5_WordToHex(lValue){
			var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
			for(lCount = 0;lCount<=3;lCount++){
					lByte = (lValue>>>(lCount*8)) & 255;
					WordToHexValue_temp = "0" + lByte.toString(16);
					WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
			}
			return WordToHexValue;
	};
	function md5_Utf8Encode(string){
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";
			for (var n = 0; n < string.length; n++) {
					var c = string.charCodeAt(n);
					if (c < 128) {
							utftext += String.fromCharCode(c);
					}else if((c > 127) && (c < 2048)) {
							utftext += String.fromCharCode((c >> 6) | 192);
							utftext += String.fromCharCode((c & 63) | 128);
					} else {
							utftext += String.fromCharCode((c >> 12) | 224);
							utftext += String.fromCharCode(((c >> 6) & 63) | 128);
							utftext += String.fromCharCode((c & 63) | 128);
					}
			}
			return utftext;
	};
	var x=Array();
	var k,AA,BB,CC,DD,a,b,c,d;
	var S11=7, S12=12, S13=17, S14=22;
	var S21=5, S22=9 , S23=14, S24=20;
	var S31=4, S32=11, S33=16, S34=23;
	var S41=6, S42=10, S43=15, S44=21;
	string = md5_Utf8Encode(string);
	x = md5_ConvertToWordArray(string);
	a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
	for (k=0;k<x.length;k+=16) {
			AA=a; BB=b; CC=c; DD=d;
			a=md5_FF(a,b,c,d,x[k+0], S11,0xD76AA478);
			d=md5_FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
			c=md5_FF(c,d,a,b,x[k+2], S13,0x242070DB);
			b=md5_FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
			a=md5_FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
			d=md5_FF(d,a,b,c,x[k+5], S12,0x4787C62A);
			c=md5_FF(c,d,a,b,x[k+6], S13,0xA8304613);
			b=md5_FF(b,c,d,a,x[k+7], S14,0xFD469501);
			a=md5_FF(a,b,c,d,x[k+8], S11,0x698098D8);
			d=md5_FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
			c=md5_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
			b=md5_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
			a=md5_FF(a,b,c,d,x[k+12],S11,0x6B901122);
			d=md5_FF(d,a,b,c,x[k+13],S12,0xFD987193);
			c=md5_FF(c,d,a,b,x[k+14],S13,0xA679438E);
			b=md5_FF(b,c,d,a,x[k+15],S14,0x49B40821);
			a=md5_GG(a,b,c,d,x[k+1], S21,0xF61E2562);
			d=md5_GG(d,a,b,c,x[k+6], S22,0xC040B340);
			c=md5_GG(c,d,a,b,x[k+11],S23,0x265E5A51);
			b=md5_GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
			a=md5_GG(a,b,c,d,x[k+5], S21,0xD62F105D);
			d=md5_GG(d,a,b,c,x[k+10],S22,0x2441453);
			c=md5_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
			b=md5_GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
			a=md5_GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
			d=md5_GG(d,a,b,c,x[k+14],S22,0xC33707D6);
			c=md5_GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
			b=md5_GG(b,c,d,a,x[k+8], S24,0x455A14ED);
			a=md5_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
			d=md5_GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
			c=md5_GG(c,d,a,b,x[k+7], S23,0x676F02D9);
			b=md5_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
			a=md5_HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
			d=md5_HH(d,a,b,c,x[k+8], S32,0x8771F681);
			c=md5_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
			b=md5_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
			a=md5_HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
			d=md5_HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
			c=md5_HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
			b=md5_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
			a=md5_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
			d=md5_HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
			c=md5_HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
			b=md5_HH(b,c,d,a,x[k+6], S34,0x4881D05);
			a=md5_HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
			d=md5_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
			c=md5_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
			b=md5_HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
			a=md5_II(a,b,c,d,x[k+0], S41,0xF4292244);
			d=md5_II(d,a,b,c,x[k+7], S42,0x432AFF97);
			c=md5_II(c,d,a,b,x[k+14],S43,0xAB9423A7);
			b=md5_II(b,c,d,a,x[k+5], S44,0xFC93A039);
			a=md5_II(a,b,c,d,x[k+12],S41,0x655B59C3);
			d=md5_II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
			c=md5_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
			b=md5_II(b,c,d,a,x[k+1], S44,0x85845DD1);
			a=md5_II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
			d=md5_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
			c=md5_II(c,d,a,b,x[k+6], S43,0xA3014314);
			b=md5_II(b,c,d,a,x[k+13],S44,0x4E0811A1);
			a=md5_II(a,b,c,d,x[k+4], S41,0xF7537E82);
			d=md5_II(d,a,b,c,x[k+11],S42,0xBD3AF235);
			c=md5_II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
			b=md5_II(b,c,d,a,x[k+9], S44,0xEB86D391);
			a=md5_AddUnsigned(a,AA);
			b=md5_AddUnsigned(b,BB);
			c=md5_AddUnsigned(c,CC);
			d=md5_AddUnsigned(d,DD);
	}
	return (md5_WordToHex(a)+md5_WordToHex(b)+md5_WordToHex(c)+md5_WordToHex(d)).toLowerCase();
};


Date.prototype.format = function(format){
	var o = {
		"M+" : this.getMonth()+1, //month
		"d+" : this.getDate(), //day
		"h+" : this.getHours(), //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter
		"S" : this.getMilliseconds() //millisecond
	}
	
	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}

	for(var k in o) {
		if(new RegExp("("+ k +")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
		}
	}
	
	return format;
};







