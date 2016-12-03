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
    public class ProductController : BaseController
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
        public JsonResult LoadData(string name,string status,int page,int pageSize=1)  
        {
            IQueryable<Product> model = db.Products;

            if (!string.IsNullOrEmpty(name))
                model = model.Where(x => x.Name.Contains(name));
            if(!string.IsNullOrEmpty(status))
            {
                var statusBool = bool.Parse(status);
                model = model.Where(x => x.Status == statusBool);
            }
            int totalRow = model.Count();
            model =model.OrderByDescending(x=>x.CreatedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize);
            
            return Json(new
            {
                data = model,
                total = totalRow,
                status=true
            },JsonRequestBehavior.AllowGet);
        }
       
        [HttpGet]
        public JsonResult GetDetail(int id)
        {
            var product = db.Products.Find(id);
            return Json(new
            {
                data = product,
                status = true
            }, JsonRequestBehavior.AllowGet);
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
        public JsonResult Delete(int id)
        {           
            var entity = db.Products.Find(id);
            db.Products.Remove(entity);
            try
            {
                db.SaveChanges();
                return Json(new
                {
                    status = true
                });
            }catch(Exception ex)
            {
                return Json(new
                {
                    status = false,
                    message=ex.Message
                });
            }
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