using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Data;

namespace WebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class NumbersController : ControllerBase
    {
        // GET api/numbers
        [HttpGet]
        public IActionResult Get()
        {
            return new JsonResult(NumberService.GetAllNumbers());
        }

        // POST api/numbers
        [HttpPost]
        public IActionResult Post([FromBody]int value)
        {
            NumberService.Add(value);
            return new NoContentResult();
        }

        // POST api/numbers/delete
        [HttpPost("Delete")]
        public IActionResult Delete([FromBody]int id)
        {
            if (NumberService.GetNumberById(id) == null)
            {
                return BadRequest();
            }

            NumberService.Delete(id);

            return new NoContentResult();
        }
    }
}
