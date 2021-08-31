$(function() {
    let layer = layui.layer
    let form = layui.form
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                //this method is from template-web.js
                let htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr)
            }
        })
    }

    let indexAdd = null
    $("#btnAddCate").on("click", function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: 'Add New Category',
            //get content from script in html page
            content: $("#dialog-add").html()
        });
    })

    //bind event on father body, then trigger is form submit which is created later
    $("body").on("submit", "#form-add", function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("Add category failed :(")
                }

                initArtCateList()
                layer.msg("Category added! ")

                //close window
                layer.close(indexAdd)
            }
        })
    })

    //bind event on father tbody, then trigger is form edit button which is created later
    let indexEdit = null
    $("tbody").on("click", ".btn-edit", function() {
            indexEdit = layer.open({
                type: 1,
                area: ['500px', '300px'],
                title: 'Edit Category',
                //get content from script in html page
                content: $("#dialog-edit").html()
            })

            let id = $(this).attr("data-id");

            $.ajax({
                method: "GET",
                url: "/my/article/cates/" + id,
                success: function(res) {
                    //Notice if id is negative, data fetch will fail
                    form.val('form-edit', res.data)
                }
            })
        })
        //bind event on father body, then trigger is form edit  which is created later
    $("body").on("submit", "#form-edit", function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("Update category failed:(")
                }
                layer.msg("Category updated! ")
                    //close window
                layer.close(indexEdit)

                initArtCateList()
            }
        })
    })

    //bind event on father tbody, then trigger is form delete button which is created later
    $("tbody").on("click", ".btn-delete", function() {
        let id = $(this).attr("data-id");
        layer.confirm('Delete category?', { icon: 3, title: 'Delete', btn: ["Delete", "Cancel"] }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        // console.log(res.message);
                        return layer.msg("Delete failed :(")
                    }
                    layer.msg("Deleted!")
                    layer.close(index);
                    initArtCateList()
                }
            })
        });

    })


})