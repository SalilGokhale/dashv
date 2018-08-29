using System.Collections.Generic;
using dashvwebapi.Entities;
using dashvwebapi.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace dashvwebapi.Controllers
{
    [Route("api/[controller]")]
    public class TechnologiesController : ControllerBase
    {
        private readonly ITechnologyService _technologyService;

        public TechnologiesController(ITechnologyService technologyService)
        {
            _technologyService = technologyService;
        }

        // GET api/technologies
        [HttpGet]
        public List<Technology> Get()
        {
            return _technologyService.GetAll();
        }
    }
}
