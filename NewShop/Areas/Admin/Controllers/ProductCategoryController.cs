using Model.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace NewShop.Areas.Admin.Controllers
{
    public class ProductCategoryController : BaseController
    {
        private NewShopDbContext db;
        public ProductCategoryController()
        {
            db = new NewShopDbContext();
        }
        // GET: Admin/ProductCategory
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public JsonResult Delete(int id)
        {
            var entity = db.ProductCategories.Find(id);
            db.ProductCategories.Remove(entity);
            try
            {
                db.SaveChanges();
                return Json(new
                {
                    status = true
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    status = false,
                    message = ex.Message
                });
            }
        }
        [HttpGet]
        public JsonResult LoadData(string name, string status, int page, int pageSize = 1)
        {
            IQueryable<ProductCategory> model = db.ProductCategories;

            if (!string.IsNullOrEmpty(name))
                model = model.Where(x => x.Name.Contains(name));
            if (!string.IsNullOrEmpty(status))
            {
                var statusBool = bool.Parse(status);
                model = model.Where(x => x.Status == statusBool);
            }
            int totalRow = model.Count();
            model = model.OrderByDescending(x => x.CreatedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize);

            return Json(new
            {
                data = model,
                total = totalRow,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetDetail(int id)
        {
            var productCategory = db.ProductCategories.Find(id);
            return Json(new
            {
                data = productCategory,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SaveData(string strProduct)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            ProductCategory product = serializer.Deserialize<ProductCategory>(strProduct);
            bool status = false;
            string message = string.Empty;
            //ADD 
            if (product.ID == 0)
            {
                product.CreatedDate = DateTime.Now;
                db.ProductCategories.Add(product);
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
                var entity = db.ProductCategories.Find(product.ID);
                entity.CreatedBy = product.CreatedBy;
                entity.CreatedDate = product.CreatedDate;
                entity.DisplayOrder = product.DisplayOrder;
                entity.MetaDescriptions = product.MetaDescriptions;
                entity.MetaKeywords = product.MetaKeywords;
                entity.MetaTitle = product.MetaTitle;
                entity.ModifiedBy = product.ModifiedBy;
                entity.ModifiedDate = product.ModifiedDate;
                entity.Name = product.Name;
                entity.ParentID = product.ParentID;
                entity.SeoTitle = product.SeoTitle;
                entity.ShowOnHome = product.ShowOnHome;
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

    }
}