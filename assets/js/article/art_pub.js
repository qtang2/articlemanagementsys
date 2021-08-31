$(function() {

    let layer = layui.layer
    let form = layui.form
    initCate()
    initEditor()


    // get all categories 
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("Get category failed :(")
                }
                // render category 
                let htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                    //render the form to ensure select element is showed
                form.render()


            }
        })
    }

    //cropper 
    var $image = $('#image')

    // cropper options
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // initialize copper
    $image.cropper(options)

    $("#chooseImage").on("click", function() {
        $("#coverFile").click()
    })

    $("#coverFile").on("change", function(e) {
        let fileList = e.target.files
        if (fileList.length == 0) {
            return layer.msg("Please choose cover image")
        }
        let file = fileList[0]
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')
            .attr('src', newImgURL)
            .cropper(options)
    })

    //define article state, default is "posted"
    let art_state = "posted"
    $("#btnSave2").on("click", function() {
        art_state = "draft"
    })

    //form submit
    $("#form-pub").on("submit", function(e) {
        e.preventDefault()

        //create a FormData instance which need a DOM element as para

        let fd = new FormData($(this)[0])

        //add article state in form data
        fd.append("state", art_state)

        //make cover image a file and add to form data
        $image
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                fd.append("cover_img", blob)
                publishArticle(fd)
            })

    })

    //define publish artice method
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            //Need to ass contentType and processData when post data is in FormData fromat
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("Post article failed :(")
                }
                layer.msg("Article posted! ")

                //jump to article list page
                location.href = "/article/art_list.html"
            }
        })
    }

})