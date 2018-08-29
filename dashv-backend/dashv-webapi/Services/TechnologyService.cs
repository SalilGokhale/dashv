using System;
using System.Collections.Generic;
using dashvwebapi.Entities;

namespace dashvwebapi.Services
{
    public interface ITechnologyService
    {
        List<Technology> GetAll();
    }

    public class TechnologyService : ITechnologyService
    {
        public List<Technology> GetAll()
        {
            return new List<Technology>
            {
                new Technology
                {
                    Name = "Angular",
                    Version = "6.1.1",
                    VersionLastDate = "14/05/18"
                }
            };
        }
    }
}
