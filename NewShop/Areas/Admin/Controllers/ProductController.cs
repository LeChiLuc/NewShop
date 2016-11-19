using Model.EF;
using NewShop.Areas.Admin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace NewShop.Areas.Admin.Controllers
{
    public class ProductController : Controller
    {
        //List<ProductModel> listProduct = new List<ProductModel>()
        //{
        //     new ProductModel()
        //    {
        //        ID = 1,
        //        Name = "A",
        //        Salary = 200,
        //        Status = true
        //    },
        //    new ProductModel()
        //    {
        //        ID = 2,
        //        Name = "B",
        //        Salary = 300,
        //        Status = false
        //    },
        //    new ProductModel()
        //    {
        //        ID = 3,
        //        Name = "C",
        //        Salary = 400,
        //        Status = true
        //    },
        //    new ProductModel()
        //    {
        //        ID = 4,
        //        Name = "D",
        //        Salary = 500,
        //        Status = true
        //    },
        //    new ProductModel()
        //    {
        //        ID = 5,
        //        Name = "E",
        //        Salary = 600,
        //        Status = true
        //    }
        //};
        public ActionResult Index()
        {
            return View();
        }
        private NewShopDbContext db;
        public ProductController()
        {
            db = new NewShopDbContext();
        }
      
        [HttpGet]
        public JsonResult LoadData(int page,int pageSize=1)  
        {
            var model = db.Products
                .OrderByDescending(x=>x.CreatedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize);
            int totalRow = db.Products.Count();
            return Json(new
            {
                data = model,
                total = totalRow,
                status=true
            },JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SaveData(string strProduct)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            Product product = serializer.Deserialize<Product>(strProduct);
            bool status = false;
            string message = string.Empty;
            //ADD 
            if(product.ID==0)
            {
                product.CreatedDate = DateTime.Now;
                db.Products.Add(product);
                try
                {
                    db.SaveChanges();
                    status = true;
                }
                catch (Exception ex)
                {
                    status = false;
                    message = ex.Message;
                }
            }
            //Update
            else
            {
                var entity = db.Products.Find(product.ID);
                entity.Price = product.Price;
                entity.Name = product.Name;
                entity.Code = product.Code;
                entity.Description = product.Description;
                entity.MetaTitle = product.MetaTitle;
                entity.Image = product.Image;
                entity.MoreImages = product.MoreImages;
                entity.CategoryID = product.CategoryID;
                entity.Status = product.Status;

                try
                {
                    db.SaveChanges();
                    status = true;
                }
                catch (Exception ex)
                {
                    status = false;
                    message = ex.Message;
                }
            }

            return Json(new
            {
                status = status,
                message = message
            });
        }

        [HttpPost]
        public JsonResult Update(string model)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            Product products = serializer.Deserialize<Product>(model);

            var entity = db.Products.Find(products.ID);
            entity.Price = products.Price;
            return Json(new
            {
                status = true
            });
        }
    }
}