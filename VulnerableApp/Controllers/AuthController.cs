using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VulnerableApp.Data;

namespace VulnerableApp.Controllers
{
    public class AuthController : Controller
    {
        private readonly AppDbContext _db;

        public AuthController(AppDbContext db)
        {
            _db = db;
        }

        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(string username, string password)
        {
            if (string.IsNullOrWhiteSpace(username) ||
                string.IsNullOrWhiteSpace(password))
            {
                ViewBag.Error = "Credenciales inválidas";
                return View();
            }

            var user = _db.Users
                .AsNoTracking()
                .FirstOrDefault(u => u.Username == username);

            if (user == null ||
                !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                ViewBag.Error = "Credenciales inválidas";
                return View();
            }

            HttpContext.Session.SetString("User", user.Username);
            HttpContext.Session.SetInt32("UserId", user.Id);

            return RedirectToAction(nameof(Dashboard));
        }

        public IActionResult Dashboard()
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            if (!userId.HasValue)
            {
                return RedirectToAction(nameof(Login));
            }

            var user = _db.Users
                .AsNoTracking()
                .FirstOrDefault(u => u.Id == userId.Value);

            if (user == null)
            {
                HttpContext.Session.Clear();
                return RedirectToAction(nameof(Login));
            }

            return View(user);
        }

        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction(nameof(Login));
        }
    }
}
