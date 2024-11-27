package com.partyhunter.ph;

import org.springframework.ui.Model;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpSession;

@Controller
public class WebController
{
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
    public String showProfilePage(HttpSession session, Model model)
    {
        return "profile";
    }
    @GetMapping("/concert.html")  // Updated path for Thymeleaf rendering
    public String showConcertPage(HttpSession session, Model model) {
        // You can pass any data to the concert page through the Model if necessary
        return "concert";  // This will render concert.html from templates directory
    }




}
