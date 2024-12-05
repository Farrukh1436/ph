package com.partyhunter.ph;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getUserById(Long id)
    { if (id == null) {
        throw new IllegalArgumentException("User ID cannot be null");
    }
        System.out.println("Fetching user with ID:"+id);
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + id));
    }
}
