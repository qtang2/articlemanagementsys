$(function() {

    // define a function handle date format 
    template.defaults.imports.dataFormat = function(date) {
        let dt = new Date(date)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return d + "-" + m + "-" + y + " " + hh + ":" + mm + ":" + ss
    }

    //define function to fill 0 for number less than 10
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //define parameters for posting data to server
    let q = {
        pagenum: 1,
        pagesize: 2, // how many list item showed on page
        cate_id: "",
        state: "" //article state
    }


    let layer = layui.layer
    let form = layui.form
    var laypage = layui.laypage;


    initTable()
    initCate("list-form", null)


    //Currently no data to fetch
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("Get article list failed :(")
                }
                //user template engine render table data
                let htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr)

                renderPage(res.total)

            }
        })
    }

    //initialize categories based of lay-filer
    //When lay-filter is edit-form, need to set related select value based on article we fetched from server
    function initCate(lay_filter, cate_id) {

        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("Get category failed :(")
                }

                let htmlStr = template("tpl-cate", res)

                $("[lay-filter=" + lay_filter + "] [name=cate_id]").html(htmlStr)


                //Set the chosen category for an article if the initial request is from edit form
                if (lay_filter === "edit-form") {
                    $(".edit-card [name=cate_id] option[value=" + cate_id + "]").attr("selected", true)
                }

                //Need to render form again because when layui renden select ele, there is no options
                //so after we get category from server, need to render the form again
                form.render('select', lay_filter)

            }
        })
    }

    //bind submit for search form
    $("#form-search").on("submit", function(e) {
        e.preventDefault()
        let cate_id = $("[name=cate_id]").val()
        let state = $("[name=state]").val()

        q.cate_id = cate_id
        q.state = state

        initTable()
    })

    function renderPage(totalArticles) {
        //user laypage to render page box

        laypage.render({
            elem: 'pageBox',
            count: totalArticles, //total article number
            limit: q.pagesize, // number each page showed
            curr: q.pagenum, //set chosen pages
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            prev: "Prev",
            next: "Next",
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                // it will be called when diff page number was clicked
                //get latest page number,and size
                q.pagenum = obj.curr
                q.pagesize = obj.limit

                //first is a boolean value which clarify who(1.laypage.render() or page clicked) trigger jump callback function
                //When first is undefied, it was triggered by page clicked
                if (!first) {
                    initTable()
                }


            }
        });
    }

    //delete event
    $("tbody").on("click", ".btn-delete", function() {
        //get delete button numbers
        let btnNums = $(".btn-delete").length
        let id = $(this).attr("data-id")
        layer.confirm('Delete article?', { icon: 3, title: 'Delete article', btn: ["Delete", "Cancel"] }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("Article delete failed :(")
                    }
                    layer.msg("Article deleted!")

                    //after deleting need to confirm is there any left item, if no, need to let page number -1
                    //if delete buttons number is 1 means after deleting , no items left, page number -1
                    if (btnNums === 1) {
                        //minumus page number is 1
                        q.pagenum = q.pagenum == 1 ? 1 : (q.pagenum - 1)
                    }
                    initTable()
                    layer.close(index);

                }
            })
        });
    })

    // edit article 
    $("tbody").on("click", ".btn-edit", function() {
        //hide list card 
        $(".list-card").hide()

        //get article id based on edit button
        let id = $(this).attr("data-id")

        initEditCard(id)

        //show list card
        $(".edit-card").show()

    })

    function initEditCard(id) {
        //get article information based article id 
        $.ajax({
            method: "GET",
            url: "/my/article/" + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("Get article failed :(")
                }
                console.log(res);

                //set article Id
                $("[name=Id]").val(res.data.Id)

                console.log("art Id " + $("[name=Id]").val());

                //set article title
                $("#form-edit  [name=title]").val(res.data.title)

                //init category
                initCate("edit-form", res.data.cate_id)

                //init text editor
                initEditor()

                //add content to text editor
                // eg: "<p><span style=\"color: #0000ff;\"><em><strong>新地球，人们很骄傲</strong></em></span></p>"
                addContent(res.data.content)

                //init cropper 
                initCropper(res.data.cover_img)

            }
        })


    }

    function addContent(htmlStr) {
        $("#editorCon").html(htmlStr)
    }

    // function initArticle(id) {
    //     $.ajax({
    //         method: "GET",
    //         url: "/my/article/" + id,
    //         success: function(res) {
    //             if (res.status !== 0) {
    //                 return layer.msg("Get article failed :(")
    //             }
    //             console.log(res);
    //             //set article title
    //             $("#form-edit  [name=title]").val(res.data.title)

    //             initCate("edit-form", res.data.cate_id)

    //         }
    //     })
    // }

    function initCropper(imgUrl) {
        // set cropper
        var $image = $('#image')

        // cropper options
        var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }

        // initialize copper
        $image.cropper(options)

        //TODO: Need to set cropper initial image

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
            console.log("newImgURL " + newImgURL);
            $image
                .cropper('destroy')
                .attr('src', newImgURL)
                .cropper(options)
        })
    }


    //define article state, default is "posted"
    let art_state = "posted"
    $("#btnSave2").on("click", function() {
        art_state = "draft"
    })

    $("#form-edit").on("submit", function(e) {
        e.preventDefault()

        //create a FormData instance which need a DOM element as para

        let fd = new FormData($(this)[0])

        //add article state in form data
        fd.append("state", art_state)


        //make cover image a file and add to form data
        $('#image')
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                fd.append("cover_img", blob)
                updateArticle(fd)
            })

    })


    //define publish artice method
    function updateArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/edit",
            data: fd,
            //Need to ass contentType and processData when post data is in FormData fromat
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("Update article failed :(")
                }
                layer.msg("Article updated! ")

                //hide article edit card
                $(".edit-card").hide()

                //refresh list card and show it
                initTable()
                initCate("list-form", null)
                $(".list-card").show()

            }
        })
    }
})