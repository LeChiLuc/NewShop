﻿using Model.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Dao
{
    public class SlideDao
    {
        NewShopDbContext db = null;
        public SlideDao()
        {
            db = new NewShopDbContext();
        }
        public List<Slide> GetAllSlide()
        {
            return db.Slides.Where(x=>x.Status == true).OrderBy(x => x.DisplayOrder).ToList();
        }
    }
}
