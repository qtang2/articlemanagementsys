$(function() {
    //get user information
    getUserInfo()

    let layer = layui.layer
        //logout
    $("#btnLogout").on("click", function() {
        //confirm callback function run when user click cofirm 
        layer.confirm('Sure to logout ?', { icon: 3, title: 'Hint', btn: ["Yes", "Cancel"] }, function(index) {

            //delete token from local storage
            localStorage.removeItem("token")
                //jump to login page
            location.href = "/login.html"

            //close confirm window
            layer.close(index);
        });
    })
})

function getUserInfo() {
    $.ajax({
        url: "/my/userinfo",
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("token") || ""
        },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg("Failed to get user infor")
            }
            //Render user profile photo
            renderAvatar(res.data)
        },
        //this will run no matter req succeed or failed
        // complete: function(res) {
        //     console.log("complete");
        //     console.log(res);
        //     //prevent directlly change url to jump to main page
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {

        //         //remove token
        //         localStorage.removeItem("token")
        //             //jump to login page
        //         location.href = "/login.html"
        //     }
        // }
    })
}

function renderAvatar(user) {
    //get displayed username
    let name = user.nickname || user.username
        // Set welcome message
    $("#welcome").html(name)

    //render user avatar if user has one
    if (user.user_pic !== null) {
        $(".layui-nav-img").attr("src", user.user_pic).show()
        $(".text-avatar").hide()
    } else {
        //render text avatar if the user do not have pic
        $(".layui-nav-img").hide()
        $(".text-avatar").html(name[0].toUpperCase()).show()
    }


}