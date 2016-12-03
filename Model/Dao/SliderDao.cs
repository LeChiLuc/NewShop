using Model.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Dao
{
    public class SliderDao
    {
        NewShopDbContext db = null;
        public SliderDao()
        {
            db = new NewShopDbContext();
        }
        public List<Slide> ListByGroupId(int groupId)
        {
            return db.Slides.Where(x => x.TypeID == groupId && x.Status == true).OrderBy(x => x.DisplayOrder).ToList();
        }
    }
}
