var homeconfig = {
    pageSize: 2,
    pageIndex: 1
}
var productCategoryController = {
    init: function () {
        productCategoryController.loadData()
        productCategoryController.registerEvent();
    },
    registerEvent: function () {
        $('#btnAddNew').off('click').on('click', function () {
            $('#modalAddUpdate').modal('show');
        });
        $('#btnSave').off('click').on('click', function () {
            productCategoryController.saveData();
        });
        $('.btn-edit').off('click').on('click', function () {
            var id = $(this).data('id');
            $('#modalAddUpdate').modal('show');
            productCategoryController.loadDetail(id);
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Are you sure to delete this product?", function (result) {

                productCategoryController.deleteProduct(id);
            });
        });
        $('#btnSearch').off('click').on('click', function () {
            productCategoryController.loadData(true);
        });
    },
    deleteProduct: function (id) {
        $.ajax({
            url: '/ProductCategory/Delete',
            data: {
                id: id
            },
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.status == true) {
                    bootbox.alert("Delete success.", function () {
                        productCategoryController.loadData(true);
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
    loadDetail: function (id) {
        $.ajax({
            url: '/ProductCategory/GetDetail',
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
                    $('#txtMetaTitle').val(data.MetaTitle);
                    $('#txtParentID').val(data.ParentID);
                    $('#txtDisplayOrder').val(data.DisplayOrder);
                    $('#txtSeoTitle').val(data.SeoTitle);
                    $('#txtCreatedDate').val(data.CreatedDate);
                    $('#txtCreatedBy').val(data.CreatedBy);
                    $('#txtModifiedDate').val(data.ModifiedDate);
                    $('#txtModifiedBy').val(data.ModifiedBy);
                    $('#txtMetaKeywords').val(data.MetaKeywords);
                    $('#txtMetaDescriptions').val(data.MetaDescriptions);
                    $('#ckStatus').prop('checked', true);
                    $('#ckShowHome').prop('checked', true);
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
        $('#txtMetaTitle').val('');
        $('#txtParentID').val('');
        $('#txtDisplayOrder').val('');
        $('#txtSeoTitle').val('');
        $('#txtCreatedDate').val('');
        $('#txtCreatedBy').val('');
        $('#txtModifiedDate').val('');
        $('#txtModifiedBy').val('');
        $('#txtMetaKeywords').val('');
        $('#txtMetaDescriptions').val('');
        $('#ckStatus').prop('checked', true);
        $('#ckShowHome').prop('checked', true);
    },
    saveData: function(){
        var name = $('#txtName').val();
        var code = $('#txtMetaTitle').val();
        var metaTitle = $('#txtParentID').val();
        var description = $('#txtDisplayOrder').val();
        var image = $('#txtSeoTitle').val
        var moreimage = $('#txtCreatedDate').val();
        var price = parseFloat($('#txtCreatedBy').val());
        var promotionPrice = parseFloat($('#txtModifiedDate').val());
        var categoryID = $('#txtModifiedBy').val();
        var categoryID = $('#txtMetaKeywords').val();
        var categoryID = $('#txtMetaDescriptions').val();
        var status = $('#ckStatus').prop('checked');
        var showHome = $('#ckShowHome').prop('checked');
        var id = parseInt($('#hidID').val());
        var productCategory = {
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
            ShowOnHome: showHome,
            ID: id
        }

        $.ajax({
            url: '/ProductCategory/SaveData',
            data: {
                strProduct: JSON.stringify(productCategory)
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
    loadData: function (changePageSize) {
        var name = $('#txtNameS').val();
        var status = $('#ddlStatusS').val();
        $.ajax({
            url: '/ProductCategory/LoadData',
            type: 'GET',
            data: {
                name: name,
                status: status,
                page: homeconfig.pageIndex,
                pageSize: homeconfig.pageSize
            },
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var template = $('#data-template').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            ID: item.ID,
                            Name: item.Name,
                            Price: item.Price,
                            Status: item.Status == true ? "<span class=\"label label-success\">Actived</span>" : "<span class=\"label label-warning\">Locked</span>"
                        })
                    });
                    $('#tblData').html(html);
                    productCategoryController.paging(response.total, function () {
                        productCategoryController.loadData();
                    }, changePageSize);
                    productCategoryController.registerEvent();
                }
            }
        })
    },
    paging: function (totalRow, callback, changePageSize) {
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
productCategoryController.init();