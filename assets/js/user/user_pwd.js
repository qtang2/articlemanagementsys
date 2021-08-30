$(function() {
    let form = layui.form

    form.verify({
        pwd: [/^[\S]{6,12}$/, "Password must between 6 to 12 and no tab/spaces"],
        samePwd: function(value) {
            if (value === $("[name=oldPwd]").val()) {
                console.log("same ");
                return "Old and new passwords must be different"
            }
        },
        rePwd: function(value) {
            if (value !== $("[name=newPwd]").val()) {
                return "Passwords are not same"
            }
        }
    })

    //submit change pwd request
    $(".layui-form").on("submit", function(e) {
        e.preventDefault()
        $.ajax({
            url: "/my/updatepwd",
            method: "POST",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    // console.log("update failed");
                    return layui.layer.msg("Password update failed :(")
                }
                // console.log("pwd updated");
                layui.layer.msg("Password updated!")

                //Reset form(Must change jquery element to DOM element to use reset method)
                $(".layui-form")[0].reset()
            }

        })
        console.log("finish ajax");
    })
})