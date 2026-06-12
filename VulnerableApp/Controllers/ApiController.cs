using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VulnerableApp.Data;

namespace VulnerableApp.Controllers
{
    [ApiController]
    [Route("api")]
    public class ApiController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ApiController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("user/{id:int}")]
        public IActionResult GetUser(int id)
        {
            var currentUserId =
                HttpContext.Session.GetInt32("UserId");

            if (!currentUserId.HasValue)
            {
                return Unauthorized();
            }

            if (id != currentUserId.Value)
            {
                return StatusCode(
                    StatusCodes.Status403Forbidden
                );
            }

            var user = _db.Users
                .AsNoTracking()
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email
                })
                .FirstOrDefault();

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("users")]
        public IActionResult GetAccessibleUsers()
        {
            var currentUserId =
                HttpContext.Session.GetInt32("UserId");

            if (!currentUserId.HasValue)
            {
                return Unauthorized();
            }

            var users = _db.Users
                .AsNoTracking()
                .Where(
                    u => u.Id == currentUserId.Value
                )
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email
                })
                .ToList();

            return Ok(users);
        }
    }
}