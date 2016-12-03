using Model.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Dao
{
    public class FooterDao
    {
        NewShopDbContext db = null;
        public FooterDao()
        {
            db = new NewShopDbContext();
        }
        public Footer GetFooter(string id)
        {
            return db.Footers.SingleOrDefault(x => x.Status == true && x.ID == id);
        }
    }
}
