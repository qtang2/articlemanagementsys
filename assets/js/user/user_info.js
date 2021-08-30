$(function() {
    let form = layui.form

    //set nickname length rule
    form.verify({
        nickname: function(value, item) {
            if (value.length <= 0 || value.length >= 12) {
                return 'Nickname must between 1-12 letters';
            }
        }
    })


    //Initialize user information
    initUserInfo()

    function initUserInfo() {
        $.ajax({
            url: "/my/userinfo",
            method: "GET",
            success: function(res) {
                if (res.status !== 0) {
                    console.log("Get user info failed");
                    return layer.msg("Get user info failed :(")
                }
                form.val("formUserInfo", res.data);
            }

        })
    }

    //Reset form data
    $("#btnReset").on("click", function(e) {
        //prevent default event which will reset all items 
        e.preventDefault()

        //Initialize user information
        initUserInfo()
    })

    //Post new user data
    let layer = layui.layer
    $(".layui-form").on("submit", function(e) {
        //Prevent form submission default 
        e.preventDefault()

        $.ajax({
            url: "/my/userinfo",
            method: "POST",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("Data update failed :(")
                }
                console.log("Data updated successfully");
                layer.msg("Data updated ")

                //Call Father page's method getUserInfo
                window.parent.getUserInfo()
            }
        })
    })


})