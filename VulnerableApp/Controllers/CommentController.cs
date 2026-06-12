using Microsoft.AspNetCore.Mvc;

namespace VulnerableApp.Controllers
{
    public class CommentController : Controller
    {
        // Lista temporal en memoria.
        // Se eliminará cuando la aplicación se reinicie completamente.
        private static List<string> _comments = new();

        public IActionResult Index()
        {
            return View(_comments);
        }

        [HttpPost]
        public IActionResult AddComment(string comment)
        {
            if (!string.IsNullOrEmpty(comment))
            {
                _comments.Add(comment);
            }

            return RedirectToAction("Index");
        }
    }
}