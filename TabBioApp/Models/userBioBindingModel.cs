using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TabBioApp.Models
{
    public class userBioBindingModel
    {
        public string Title { get; set; }
        public string Bio { get; set; }
        public string website { get; set; }

        public AspNetUser AspNetUser { get; set; }
    }
}