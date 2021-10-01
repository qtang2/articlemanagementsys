$(function() {
    // Click 'Register'
    $("#link_reg").on("click", function() {
            $(".reg-box").show()
            $(".login-box").hide()
        })
        //Click 'Login'
    $("#link_login").on("click", function() {
        $(".reg-box").hide()
        $(".login-box").show()
    })

    //get form from layui
    let form = layui.form

    //get layer form layui
    let layer = layui.layer

    //define password rule using verify function with a regular expression
    form.verify({
        pwd: [/^[\S]{6,12}$/, "password must between 6 to 16 and no tab/space"],
        repwd: function(value, item) {
            //get pwd value via attribute selector
            let pwd = $(".reg-box [name=password]").val()
            if (pwd !== value) {
                return "Passwords not match"
            }

        }
    })

    //Register form submit
    $("#form_reg").on("submit", function(e) {
        //prevent default action jump to another page
        e.preventDefault()

        //send post request
        let data = {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val()
        }
        $.post("/api/reguser", data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('Register successfully,please login');
            //manually trigger login click event
            $("#link_login").click()

            //I registered xiaowang123 pwd111111
        })
    })

    //Login form submit\
    $("#form_login").submit(function(e) {
        //prevent default event
        e.preventDefault()
        $.ajax({
            url: "/api/login",
            method: "POST",
            //quickly get data from login form
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg("Login failed")
                }
                layer.msg("Login successfully")

                //save token to local storage for later user
                localStorage.setItem('token', res.token)

                //jump to index page
                location.href = "/index.html"
            }
        })

    })

})