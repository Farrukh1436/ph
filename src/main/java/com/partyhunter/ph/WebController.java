package com.partyhunter.ph;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class WebController
{

    @Autowired
    private UserService userService;
    @GetMapping("")
    public String home_page()
    {
        return "index";
    }
    @GetMapping("/login.html")
    public String login_page()
    {
        return "login";
    }
    @GetMapping("/sign_in.html")
    public String sign_in_page()
    {
        return "sign_in";
    }
    @GetMapping("/index.html")
    public String showHomePage(HttpSession session, Model model) {
        // Retrieve the 'user' from the session
        User user = (User) session.getAttribute("user");

        // Pass the 'user' attribute to the Thymeleaf template
        model.addAttribute("user", user);

        return "index"; // This will render the index.html template
    }

    @GetMapping("/profile.html")
    public String getProfile(HttpSession session, Model model) {
        // Retrieve the 'user' object from the session
        User user = (User) session.getAttribute("user");

        if (user == null) {
            // If no user is found in the session, redirect to login page
            return "redirect:/login.html";
        }

        // Fetch the user ID from the 'user' object
        Long userId = user.getId();  // Assuming 'user' has a 'getId()' method

        // Fetch user details from the database using userId
        User fetchedUser = userService.getUserById(userId);

        // Add the fetched user data to the model to pass it to the view
        model.addAttribute("user", fetchedUser);

        return "profile";  // This returns the profile.html view
    }


    @GetMapping("/concert.html")  // Updated path for Thymeleaf rendering
    public String showConcertPage(HttpSession session, Model model) {

        // Retrieve the 'user' from the session
        User user = (User) session.getAttribute("user");

        // Pass the 'user' attribute to the Thymeleaf template
        model.addAttribute("user", user);
        // You can pass any data to the concert page through the Model if necessary
        return "concert";  // This will render concert.html from templates directory
    }




}
