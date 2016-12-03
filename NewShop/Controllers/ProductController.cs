using Model.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NewShop.Controllers
{
    public class ProductController : Controller
    {
        // GET: Product
        public ActionResult Detail(long id)
        {
            var product = new ProductDao().ViewDetail(id);
            ViewBag.Category = new ProductDao().ViewDetail(product.CategoryID.Value);
            return View(product);
        }
       
    }
}