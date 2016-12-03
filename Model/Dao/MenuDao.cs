using Model.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Dao
{
    public class MenuDao
    {
        NewShopDbContext db = null;
        public MenuDao()
        {
            db = new NewShopDbContext();
        }
        public List<Menu> ListByGroupId(int groupId)
        {
            return db.Menus.Where(x => x.TypeID == groupId && x.Status==true).OrderBy(x=>x.DisplayOrder).ToList();
        }
        public Menu ViewDetail(long id)
        {
            return db.Menus.Find(id);
        }
    }
}
