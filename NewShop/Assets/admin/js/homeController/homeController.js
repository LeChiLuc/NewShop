var homeconfig = {
    pageSize: 2,
    pageIndex: 1
}
var homeController = {
    init: function () {
       
        homeController.loadData();
        homeController.registerEvent();
    },
    registerEvent:function(){
        $('.txtSalary').off('keypress').on('keypress', function (e) {
            if(e.which==13)
            {
                var id = $(this).data('id');
                var value = $(this).val();

                homeController.updateSalary(id, value);
            }
        });
        $('#txtNameS').off('keypress').on('keypress', function (e) {
            if (e.which == 13) {
                homeController.loadData(true);
            }
        });
        $('#btnSelectImage').off('click').on('click', function (e) {
            e.preventDefault();
            var finder = new CKFinder();
            finder.selectActionFunction = function (url) {
                $('#txtImage').val(url);
            };
            finder.popup();
        });
        $('#btnAddNew').off('click').on('click', function () {
            $('#modalAddUpdate').modal('show');
            homeController.resetForm();
        });
        $('#btnSave').off('click').on('click', function () {
            homeController.saveData();
        });
        $('#btnSearch').off('click').on('click', function () {
            homeController.loadData(true);
        });
        $('#btnReset').off('click').on('click', function () {
            $('#txtNameS').val('');
            $('#ddlStatusS').val('');
            homeController.loadData(true);
        });
        $('.btn-edit').off('click').on('click', function () {
            var id = $(this).data('id');
            $('#modalAddUpdate').modal('show');           
            homeController.loadDetail(id);
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Are you sure to delete this product?", function (result) {
                
                homeController.deleteProduct(id);
            });
        });
    },
    deleteProduct:function(id){
        $.ajax({
            url: '/Product/Delete',
            data: {
                id: id
            },
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.status == true) {
                    bootbox.alert("Delete success.", function () {
                        homeController.loadData(true);
                    });

                }
                else {
                    alert(response.message);
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    },
    saveData: function(){
        var name = $('#txtName').val();
        var code = $('#txtCode').val();
        var metaTitle = $('#txtMetaTitle').val();
        var description = $('#txtDescription').val();
        var image = $('#txtImage').val
        var moreimage = $('#txtMoreImages').val();
        var price = parseFloat($('#txtPrice').val());
        var promotionPrice = parseFloat($('#txtPromotionPrice').val());
        var categoryID = $('#txtCategoryID').val();
        var status = $('#ckStatus').prop('checked');
        var id = parseInt($('#hidID').val());
        var product = {
            Name: name,
            Code: code,
            MetaTitle: metaTitle,
            Description: description,
            Image: image,
            MoreImages: moreimage,
            Price: price,
            PromotionPrice: promotionPrice,
            CategoryID: categoryID,
            Status: status,
            ID: id
        }

        $.ajax({
            url: '/Product/SaveData',
            data: {
              strProduct: JSON.stringify(product)
            },
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.status == true) {
                    bootbox.alert("Save success.", function () {
                        $('#modalAddUpdate').modal('hide');
                        homeController.loadData(true);
                    });
                   
                }
                else {
                    bootbox.alert(response.message);
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    },
    resetForm:function(){
        $('#hidID').val('0');
        $('#txtName').val('');
        $('#txtCode').val('');
        $('#txtMetaTitle').val('');
        $('#txtDescription').val('');
        $('#txtImage').val('');
        $('#txtMoreImages').val('');
        $('#txtPrice').val('');
        $('#txtPromotionPrice').val('');
        $('#txtCategoryID').val('');
        $('#ckStatus').prop('checked', true);
    },
    updateSalary: function (id, value) {
        var data = {
            ID: id,
            Salary: value
        };
        $.ajax({
            url: '/Product/Update',
            type: 'POST',
            dataType: 'json',
            data: {model:JSON.stringify(data)},
            success:function(response){
                if (response.status)
                {
                    bootbox.alert("Update Success");
                }
                else
                {
                    bootbox.alert(response.message);
                }
            }
        })
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/Product/GetDetail',
            data: {
                id:id
            },
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status == true) {
                    var data= response.data
                    $('#hidID').val(data.ID);
                    $('#txtName').val(data.Name);
                    $('#txtCode').val(data.Code);
                    $('#txtMetaTitle').val(data.MetaTitle);
                    $('#txtDescription').val(data.Description);
                    $('#txtImage').val(data.Image);
                    $('#txtMoreImages').val(data.MoreImages);
                    $('#txtPrice').val(data.Price);
                    $('#txtPromotionPrice').val(data.PromotionPrice);
                    $('#txtCategoryID').val(data.CategoryID);
                    $('#ckStatus').prop('checked', data.Status);
                }
                else {
                    bootbox.alert(response.message);
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    },
    loadData: function (changePageSize) {
        var name =$('#txtNameS').val();
        var status = $('#ddlStatusS').val();
        $.ajax({
            url: '/Product/LoadData',
            type: 'GET',
            data: {
                name:name,
                status:status,
                page: homeconfig.pageIndex,
                pageSize: homeconfig.pageSize
            },
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data =response.data;
                    var html='';
                    var template = $('#data-template').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            ID: item.ID,
                            Name: item.Name,
                            Price: item.Price,
                            Status: item.Status==true?"<span class=\"label label-success\">Actived</span>":"<span class=\"label label-warning\">Locked</span>"
                        })
                    });
                    $('#tblData').html(html);
                    homeController.paging(response.total, function () {
                        homeController.loadData();
                    }, changePageSize);
                    homeController.registerEvent();
                }
            }
        })
    },
    paging: function (totalRow, callback,changePageSize) {
        var totalPage = Math.ceil(totalRow / homeconfig.pageSize);

        if ($('#pagination a').length === 0 || changePageSize === true) {
            $('#pagination').empty();
            $('#pagination').removeData("twbs-pagination");
            $('#pagination').unbind("page");
        }

        $('#pagination').twbsPagination({
            totalPages: totalPage,
            first: "Đầu",
            next: "Tiếp",
            last: "Cuối",
            prev: "Trước",
            visiblePages: 10,
            onPageClick: function (event, page) {
                homeconfig.pageIndex = page;
                setTimeout(callback, 200);
            }
        });
    }
}
homeController.init();