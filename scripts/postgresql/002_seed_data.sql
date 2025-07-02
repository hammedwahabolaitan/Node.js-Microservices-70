-- Insert default admin user
INSERT INTO users (email, name, password_hash, role, is_verified) 
VALUES (
    'admin@example.com', 
    'Admin User', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'admin', 
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert default regular user
INSERT INTO users (email, name, password_hash, role, is_verified) 
VALUES (
    'user@example.com', 
    'Regular User', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'user', 
    true
) ON CONFLICT (email) DO NOTHING;
