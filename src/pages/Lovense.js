import React, { useEffect } from 'react'

var params;
// params.append("token="+token).append("&");
// params.append("uid="+uid).append("&");
// params.append("command="+command).append("&");
// params.append("v="+v);

 const Lovense = () => {
    useEffect(() => {
        window.lovense = window.Lovense = window.lovense || window.Lovense || {};
        var lovense = window.lovense;

        var isPCLanAvailable = false;
        var isMobileLanAvailable = false;

        var pcToys = {};
        var mobileToys = {};

        var mobileData = null;
        var serverCommandCallback = null;


        var checkPCInterval = setInterval(function () {
            ajax({
                url: 'https://api.lovense.com/api/lan/GetToys',


                success: function (response) {

                    var data = response;
                    if (typeof response === 'string') {
                        data = JSON.parse(response);
                    }
                    pcToys = data.data;
                    for (var key in pcToys) {
                        var toy = pcToys[key];
                        if (toy.status) {
                            isPCLanAvailable = true;
                        }
                    }

                },
                error: function (status) {
                    isPCLanAvailable = false;
                    pcToys = [];
                }
            });
        }, 3 * 1000);

        var checkMobileInterval = setInterval(function () {
            if (!mobileData || !mobileData.domain || !mobileData.httpsPort) {
                isMobileLanAvailable = false;
                pcToys = [];
            } else {
                alert(1)
                ajax({
                    url: 'https://' + mobileData.domain + ':' + mobileData.httpsPort + '/GetToys',
                    success: function (response) {

                        var data = response;
                        if (typeof response === 'string') {
                            data = JSON.parse(response);
                        }
                        mobileToys = data.data;
                        for (var key in mobileToys) {
                            var toy = mobileToys[key];
                            if (toy.status) {
                                isMobileLanAvailable = true;
                            }
                        }
                    },
                    error: function (status) {
                        isMobileLanAvailable = false;
                        //mobileToys = [];
                    }
                });
            }
        }, 3 * 1000);

        var formatParams = function (data) {
            var arr = [];
            for (var name in data) {
                arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
            }
            arr.push(('vrandom=' + Math.random()).replace('.', ''));
            return arr.join('&');
        }

        var ajax = function (options) {
            options = options || {};
            options.type = (options.type || 'GET').toUpperCase();
            options.dataType = options.dataType || 'json';
            options.timeout = options.timeout || 10000;//超时处理，默认10s
            params = formatParams(options.data);

            var xhr;
            var xmlHttp_timeout = null;
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else {
                xhr = ActiveXObject('Microsoft.XMLHTTP');
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    clearTimeout(xmlHttp_timeout);
                    var status = xhr.status;
                    if (status >= 200 && status < 300) {
                        options.success && options.success(xhr.responseText, xhr.responseXML);
                    } else {
                        options.error && options.error(status);
                    }
                }
            }

            if (options.type == 'GET') {
                xhr.open('GET', options.url + '?' + params, true);
                xhr.send(null);
            } else if (options.type == 'POST') {
                xhr.open('POST', options.url, true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send(params);
            }
            xmlHttp_timeout = setTimeout(function () {
                xhr.abort();
                //options.error&&options.error(504);
            }, options.timeout);
        }

        lovense.setConnectCallbackData = function (mobileCallbackData) {
            mobileData = mobileCallbackData;
            if (mobileCallbackData && mobileCallbackData.toys) {
                mobileToys = mobileCallbackData.toys;
            }
        }

        lovense.setServerCommandListener = function (callback) {
            serverCommandCallback = callback;
        }
        lovense.getToys = function () {
            var toys = [];
            for (var key in pcToys) {
                toys.push(pcToys[key]);
            }
            for (var key in mobileToys) {
                toys.push(mobileToys[key]);
            }
            return toys;
        }
        lovense.getOnlineToys = function () {
            var toys = [];
            for (var key in pcToys) {
                var toy = pcToys[key];
                if (toy.status) {
                    toys.push(toy);
                }
            }
            for (var key in mobileToys) {
                var toy = mobileToys[key];
                if (toy.status) {
                    toys.push(toy);
                }
            }
            return toys;
        }

        lovense.isToyOnline = function () {
            return lovense.getOnlineToys().length > 0;
        }

        lovense.sendCommand = function (command, data) {
            if (lovense.isToyOnline()) {
                if (isPCLanAvailable || isMobileLanAvailable) {
                    if (isPCLanAvailable) {
                        ajax({
                            url: 'https://api.lovense.com/api/lan/' + command,
                            data: data,
                            success: function (response, xml) {
                                isPCLanAvailable = true;
                            },
                            error: function (status) {
                                isPCLanAvailable = false;
                            }
                        });
                    }
                    if (isMobileLanAvailable) {
                        ajax({
                            url: 'https://' + mobileData.domain + ':' + mobileData.httpsPort + '/' + command,
                            data: data,
                            success: function (response, xml) {
                                isPCLanAvailable = true;
                            },
                            error: function (status) {
                                isPCLanAvailable = false;
                            }
                        });
                    }
                } else {
                    if (serverCommandCallback) {
                        serverCommandCallback(command, data);
                    }
                }
            }
        }
    })
    return (
        <>Lovense</>
    )
}

export default Lovense