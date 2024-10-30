// Controllers/AuthController.cs

using Microsoft.AspNetCore.Mvc;

namespace BackendService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // POST: api/auth/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            // Simple username and password check
            if (model.Username == "admin" && model.Password == "admin")
            {
                // For simplicity, return a success message or a token
                return Ok(new { message = "Login successful" });
            }
            else
            {
                // Return unauthorized status if credentials are invalid
                return Unauthorized(new { message = "Invalid credentials" });
            }
        }
    }

    // Model to represent the login data
    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
