using Model.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Dao
{
    public class ProductDao
    {
        NewShopDbContext db = null;
        public ProductDao()
        {
            db = new NewShopDbContext();
        }
        public List<Product> ListNewProduct(int top)
        {
            return db.Products.Where(x=>x.Status == true).OrderByDescending(x => x.CreatedDate).Take(top).ToList();
        }
        public List<Product> ListFeatureProduct(int top)
        {
            return db.Products.Where(x => x.TopHot != null && x.TopHot>DateTime.Now).OrderByDescending(x => x.CreatedDate).Take(top).ToList();
        }
        public List<Product> ListLastestProduct(int top)
        {
            return db.Products.Where(x => x.Status == true).OrderByDescending(x => x.CreatedDate).Take(top).ToList();
        }
        public List<Product> ListPromotionProduct(int top)
        {
            return db.Products.Where(x => x.Status == true && x.PromotionPrice != null).OrderByDescending(x => x.CreatedDate).Take(top).ToList();
        }
        public Product ViewDetail(long id)
        {
            return db.Products.Find(id);
        }
    }
}
