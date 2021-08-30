//In order to manage urls when sending any request using ajax

//ajaxPrefilter function will be called before calling $.get() $.post() $.ajax()
//all options in ajaxPrefilter can be accessed

$.ajaxPrefilter(function(options) {
    //prepend root directory before sending request to make it right directory
    options.url = "http://api-breakingnews-web.itheima.net" + options.url

    //Set headers for all request that need authorization
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = { Authorization: localStorage.getItem("token") || "" }
    }

    //this will run no matter req succeed or failed
    //Set a complete attribute for all request
    options.complete = function(res) {

        //prevent directlly change url to jump to main page
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {

            //remove token
            localStorage.removeItem("token")
                //jump to login page
            location.href = "/login.html"
        }
    }

})