using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NewShop.Areas.Admin.Models
{
    public class ProductModel
    {
        public int ID { set; get; }
        public string Name { set; get; }
        public double Salary { set; get; }
        public bool Status { set; get; }
    }
}