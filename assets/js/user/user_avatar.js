$(function() {
    var $image = $('#image')
        // set options
    const options = {
        // set the cropper box to be a sqaure
        aspectRatio: 1,
        // set the preview
        preview: '.img-preview',
    }

    // create cropper area
    $image.cropper(options)

    //choose image button will trigger file input click event
    $("#btnChooseImage").on("click", function() {
        $("#file").click()
    })

    let layer = layui.layer
        //file input change event
    $("#file").on("change", function(e) {
        let fileList = e.target.files
        if (fileList.length == 0) {
            return layer.msg("Please choose an image")
        }

        //get the file
        var file = e.target.files[0]
            // console.log(file);
            //Create image src
        var newImgURL = URL.createObjectURL(file)
            //set new image
        $image
            .cropper('destroy') // clear previous cropper area
            .attr('src', newImgURL) //change image src
            .cropper(options) // initialize cropper area
    })

    //Upload profile photo
    $("#btnUpload").on("click", function() {
        //get user avatar and make it a base64 string
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                //Create a canvas
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
            // make content on canvas a base64 string

        $.ajax({
            url: "/my/update/avatar",
            method: "POST",
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("Change avatar failed :(")
                }
                layer.msg("Avatar updated! ")

                //initialize avatar again
                window.parent.getUserInfo()
            }

        })
    })

})