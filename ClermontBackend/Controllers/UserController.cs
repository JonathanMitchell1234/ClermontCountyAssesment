using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendService.Data;
using BackendService.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackendService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpGet("{uuid}")]
        public async Task<ActionResult<User>> GetUser(Guid uuid)
        {
            var user = await _context.Users.FindAsync(uuid);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { uuid = user.Uuid }, user);
        }

        [HttpPut("{uuid}")]
        public async Task<IActionResult> PutUser(Guid uuid, User user)
        {
            if (uuid != user.Uuid)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(uuid))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{uuid}")]
        public async Task<IActionResult> DeleteUser(Guid uuid)
        {
            var user = await _context.Users.FindAsync(uuid);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(Guid uuid)
        {
            return _context.Users.Any(e => e.Uuid == uuid);
        }
    }
}