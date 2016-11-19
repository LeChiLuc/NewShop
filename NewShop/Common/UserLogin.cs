using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NewShop.Common
{
    [Serializable] //chuyen doi sang nhi phan
    public class UserLogin
    {
        public long UserID { set; get; }
        public string UserName { set; get; }
    }
}