using Model.Dao;
using NewShop.Common;
using NewShop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NewShop.Controllers
{
    public class HomeController : Controller
    {
       
        public ActionResult Index()
        {
            ViewBag.Slide = new SlideDao().GetAllSlide();
            var productDao = new ProductDao();
            ViewBag.ListNewProducts = productDao.ListNewProduct(4);
            ViewBag.ListFeatureProducts = productDao.ListFeatureProduct(4);
            ViewBag.ListPromotionProducts = productDao.ListPromotionProduct(4);
            ViewBag.ListLastestProducts = productDao.ListLastestProduct(6);
            return View();
        }
        [ChildActionOnly]
        public ActionResult Menu()
        {
            var model = new MenuDao().ListByGroupId(1);
            return PartialView(model);
        }
        [ChildActionOnly]
        public ActionResult TopMenu()
        {
            var model = new MenuDao().ListByGroupId(2);
            return PartialView(model);
        }
        [ChildActionOnly]
        public PartialViewResult HeaderCart()
        {
            var cart = Session[CommonConstants.CartSession];
            var list = new List<CartItem>();
            if (cart != null)
            {
                list = (List<CartItem>)cart;
            }
          
            return PartialView(list);
        }
        [ChildActionOnly]
        public ActionResult Footer()
        {
            var model = new FooterDao().GetFooter("footer2");
            return PartialView(model);
        }
    }
}