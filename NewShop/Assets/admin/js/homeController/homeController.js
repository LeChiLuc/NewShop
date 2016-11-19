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

        $('#btnAddNew').off('click').on('click', function () {
            $('#modalAddUpdate').modal('show');
            homeController.resetForm();
        });
        $('#btnSave').off('click').on('click', function () {
            homeController.saveData();
        });
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
                if (status == true) {
                    alert('Save success');
                    $('#modalAddUpdate').modal('hide');
                    homeController.loadData();
                }
                else {
                    alert(response.Message);
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
                    alert('Update successed.');
                }
                else
                {
                    alert('Update failed.');
                }
            }
        })
    },
    loadData: function () {
        $.ajax({
            url: '/Product/LoadData',
            type: 'GET',
            data: {
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
                    });
                    homeController.registerEvent();
                }
            }
        })
    },
    paging: function (totalRow, callback) {
        var totalPage = Math.ceil(totalRow / homeconfig.pageSize);
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