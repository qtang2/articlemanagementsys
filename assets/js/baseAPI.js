//In order to manage urls when sending any request using ajax

//ajaxPrefilter function will be called before calling $.get() $.post() $.ajax()
//all options in ajaxPrefilter can be accessed

$.ajaxPrefilter(function(options) {
    //prepend root directory before sending request to make it right directory
    options.url = "http://api-breakingnews-web.itheima.net" + options.url
})