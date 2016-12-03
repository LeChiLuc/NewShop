using Model.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NewShop.Controllers
{
    public class MenuController : Controller
    {
        public ActionResult ListProduct(long id)
        {
            var product = new ProductDao().ViewDetail(id);
            ViewBag.Category = new MenuDao().ViewDetail(product.MenuID.Value);
            return View(product);
        }
    }
}