package com.partyhunter.ph;



import java.util.Optional;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;






@Controller
public class UserController
{

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/sign_in")
    public String handle_sign_in(@RequestParam String username, @RequestParam String email,
                                 @RequestParam String password,
                                 RedirectAttributes redirectAttributes,
                                 HttpSession session)
    {
        // Check if a user with the same username  already exists
        Optional<User> existingUser = userRepository.findByUsername(username);
        // Check if a user with the same  email already exists
        Optional<User> existingEmail = userRepository.findByEmail(email);


        boolean hasError = false;  // Track if any error exists




        if (existingUser.isPresent())
        {
            redirectAttributes.addFlashAttribute("error_username", "Username already exists! Please try again!");
            hasError = true;  // Mark that an error exists
        }
        if (existingEmail.isPresent())
        {
            redirectAttributes.addFlashAttribute("error_email", "Email already exists! Please try again!");
            hasError = true;
        }

        // Redirect if any errors were found
        if (hasError)
        {
            return "redirect:/sign_in.html";  // Return to the signup page with collected errors
        }
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password); // Consider hashing the password

        userRepository.save(user);
        // Set session attribute for logged in status
        session.setAttribute("user", user);

        return "redirect:/index.html";  // Redirect to a success page
    }

    @PostMapping("/login")
    public String handle_login(@RequestParam String username,
                               @RequestParam String password,
                               RedirectAttributes redirectAttributes,
                                         HttpSession session) {
        // Check if a user with the same username exists
        Optional<User> existingUser = userRepository.findByUsername(username);
        User user = existingUser.get();
        boolean hasError = false;  // Track if any error exists

        if (!(existingUser.isPresent()))
        {
            redirectAttributes.addFlashAttribute("error_user", "Username does not exist! Please try to sign in!");
            hasError = true;
        }
        else
        {
            // Compare the entered password with the stored password (hash comparison)


            // Assume you have a password hashing mechanism in place, like BCrypt:
            if (!(user.getPassword().equals(password)))
            {
                redirectAttributes.addFlashAttribute("error_password", "Password is incorrect! Please try again!");
                hasError = true;
            }
        }

        // If there's an error, redirect back to login page
        if (hasError) {
            return "redirect:/login.html";
        }

        // Set session attribute for logged in status
        session.setAttribute("user", user);

        // Redirect to a success page (user is authenticated)
        return "redirect:/index.html";
    }

}

