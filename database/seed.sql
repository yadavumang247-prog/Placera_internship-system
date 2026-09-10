-- ==========================================================
-- SMARTINTERN - REALISTIC SEED DATA (PostgreSQL SQL)
-- 20 Students, 5 Companies, 10 Internships, Realistic Preferences
-- ==========================================================

-- Password hash for 'Password@123' (bcrypt): $2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme
-- Admin password 'Admin@123': $2a$10$64Q5Qe3Y6B5a9SjXo9y2he12e9G8e71c6h0s9z0A1b2c3d4e5f6g7

-- 1. INSERT USERS
INSERT INTO users (id, name, email, password_hash, role) VALUES
('u_admin', 'Dean of Placements', 'admin@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'ADMIN'),
('u_comp_google', 'Google Campus Recruitment', 'google@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'COMPANY'),
('u_comp_msft', 'Microsoft University Relations', 'microsoft@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'COMPANY'),
('u_comp_amazon', 'Amazon Student Programs', 'amazon@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'COMPANY'),
('u_comp_adobe', 'Adobe Talent Acquisition', 'adobe@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'COMPANY'),
('u_comp_tcs', 'TCS Early Careers', 'tcs@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'COMPANY'),

-- Students
('u_s1', 'Aarav Sharma', 'student@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s2', 'Priya Patel', 'priya@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s3', 'Rohan Verma', 'rohan@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s4', 'Ananya Iyer', 'ananya@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s5', 'Kabir Mehta', 'kabir@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s6', 'Ishita Rao', 'ishita@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s7', 'Aditya Nair', 'aditya@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s8', 'Sneha Kulkarni', 'sneha@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s9', 'Vikram Sen', 'vikram@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s10', 'Neha Gupta', 'neha@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s11', 'Arjun Reddy', 'arjun@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s12', 'Tanvi Joshi', 'tanvi@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s13', 'Siddharth Bose', 'siddharth@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s14', 'Divya Menon', 'divya@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s15', 'Varun Kapoor', 'varun@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s16', 'Pooja Hegde', 'pooja@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s17', 'Kunal Deshmukh', 'kunal@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s18', 'Riya Bhattacharya', 'riya@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s19', 'Gaurav Gill', 'gaurav@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT'),
('u_s20', 'Meera Pillai', 'meera@example.com', '$2a$10$wEeV0jK21.vjKx0XhKk1lOPF7e/4GqM1Ufx8e/4mXzXjJ2qOQeZme', 'STUDENT');

-- 2. INSERT COMPANIES
INSERT INTO companies (id, user_id, name, description, logo_url, website, industry, location) VALUES
('comp_google', 'u_comp_google', 'Google India', 'Global leader in internet search, cloud computing, systems infrastructure and artificial intelligence.', 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80', 'https://careers.google.com', 'Internet & Software', 'Bangalore, Karnataka'),
('comp_msft', 'u_comp_msft', 'Microsoft IDC', 'Empowering every person and organization on the planet to achieve more through cloud, AI, and developer tooling.', 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=120&auto=format&fit=crop&q=80', 'https://careers.microsoft.com', 'Enterprise Cloud & AI', 'Hyderabad, Telangana'),
('comp_amazon', 'u_comp_amazon', 'Amazon Development Centre', 'Earth''s most customer-centric company, innovating across AWS cloud services, logistics, and retail tech.', 'https://images.unsplash.com/photo-1523474255658-4af61b1684c3?w=120&auto=format&fit=crop&q=80', 'https://amazon.jobs', 'Cloud Computing & E-Commerce', 'Bangalore, Karnataka'),
('comp_adobe', 'u_comp_adobe', 'Adobe Systems', 'Changing the world through digital experiences, creative cloud, document cloud, and deep visual AI.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80', 'https://adobe.com/careers', 'Digital Media & AI', 'Noida, Uttar Pradesh'),
('comp_tcs', 'u_comp_tcs', 'Tata Consultancy Services', 'Global IT services, consulting, and business solutions partner delivering digital transformation at scale.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80', 'https://tcs.com/careers', 'IT Services & Consulting', 'Mumbai, Maharashtra');

-- 3. INSERT 10 INTERNSHIPS
INSERT INTO internships (id, company_id, title, description, location, mode, stipend, duration, minimum_cgpa, allowed_branches, required_skills, total_seats, available_seats, application_deadline, status) VALUES
('int_g_cloud', 'comp_google', 'Cloud Systems Engineering Intern', 'Architect scalable distributed backend microservices and containerized storage nodes.', 'Bangalore, Karnataka', 'HYBRID', 85000, '6 Months', 8.50, '["Computer Science", "Information Technology", "Artificial Intelligence & Data Science"]', '["Go", "Kubernetes", "Docker", "Distributed Systems", "Python"]', 2, 2, '2026-12-31', 'ACTIVE'),
('int_g_ai', 'comp_google', 'AI & Machine Learning Research Intern', 'Develop deep learning pipelines, transformer architectures, and foundation models.', 'Bangalore, Karnataka', 'HYBRID', 90000, '6 Months', 8.80, '["Computer Science", "Artificial Intelligence & Data Science"]', '["PyTorch", "TensorFlow", "Python", "Deep Learning", "Algorithms"]', 1, 1, '2026-12-31', 'ACTIVE'),
('int_ms_fullstack', 'comp_msft', 'Full Stack Cloud Platform Intern', 'Build cloud-native web portals and developer tooling on Azure using TypeScript and React.', 'Hyderabad, Telangana', 'REMOTE', 75000, '3 Months', 8.00, '["Computer Science", "Information Technology", "Electronics & Communication"]', '["TypeScript", "React", "Node.js", "Azure", "SQL"]', 2, 2, '2026-12-31', 'ACTIVE'),
('int_ms_data', 'comp_msft', 'Data Platform & Analytics Intern', 'Design analytical data lakehouse queries, streaming pipelines, and telemetry systems.', 'Hyderabad, Telangana', 'HYBRID', 72000, '6 Months', 7.80, '["Computer Science", "Information Technology", "Artificial Intelligence & Data Science", "Electronics & Communication"]', '["Python", "SQL", "Spark", "Data Modeling", "PowerBI"]', 2, 2, '2026-12-31', 'ACTIVE'),
('int_amz_sde', 'comp_amazon', 'Software Development Engineer Intern', 'Engineer high-throughput transactional backends powering millions of daily order workflows.', 'Bangalore, Karnataka', 'ONSITE', 80000, '6 Months', 8.20, '["Computer Science", "Information Technology"]', '["Java", "Spring Boot", "AWS", "DynamoDB", "Data Structures"]', 2, 2, '2026-12-31', 'ACTIVE'),
('int_amz_devops', 'comp_amazon', 'DevOps & Site Reliability Intern', 'Automate CI/CD deployment pipelines, infrastructure as code, and cloud monitoring.', 'Chennai, Tamil Nadu', 'HYBRID', 68000, '3 Months', 7.50, '["Computer Science", "Information Technology", "Electronics & Communication"]', '["Linux", "AWS", "Terraform", "Docker", "Bash"]', 2, 2, '2026-12-31', 'ACTIVE'),
('int_adb_frontend', 'comp_adobe', 'Design Systems & Frontend Intern', 'Craft pixel-perfect, accessible UI components and modern web canvases for creative suites.', 'Noida, Uttar Pradesh', 'REMOTE', 70000, '3 Months', 7.50, '["Computer Science", "Information Technology", "Electronics & Communication"]', '["React", "TypeScript", "Tailwind CSS", "Next.js", "Web Standards"]', 2, 2, '2026-12-31', 'ACTIVE'),
('int_adb_cv', 'comp_adobe', 'Computer Vision & Multimedia Intern', 'Implement real-time neural filter algorithms for creative digital image and video rendering.', 'Noida, Uttar Pradesh', 'HYBRID', 78000, '6 Months', 8.30, '["Computer Science", "Artificial Intelligence & Data Science", "Electronics & Communication"]', '["C++", "OpenCV", "Python", "Computer Vision", "Machine Learning"]', 1, 1, '2026-12-31', 'ACTIVE'),
('int_tcs_digital', 'comp_tcs', 'Digital Enterprise Software Intern', 'Modernize enterprise ERP services and APIs using cloud architecture and microservices.', 'Mumbai, Maharashtra', 'HYBRID', 45000, '3 Months', 6.50, '["All Branches"]', '["Java", "SQL", "HTML", "JavaScript", "Spring"]', 3, 3, '2026-12-31', 'ACTIVE'),
('int_tcs_embed', 'comp_tcs', 'IoT & Embedded Systems Intern', 'Program firmware, sensor integrations, and edge telemetry devices for smart grid networks.', 'Pune, Maharashtra', 'ONSITE', 42000, '3 Months', 6.80, '["Electronics & Communication", "Mechanical Engineering"]', '["Embedded C", "Microcontrollers", "RTOS", "IoT", "Sensors"]', 2, 2, '2026-12-31', 'ACTIVE');

-- 4. INSERT 20 STUDENTS
INSERT INTO students (id, user_id, roll_number, branch, year, graduation_year, cgpa, experience_months, experience_summary, skills, resume_url) VALUES
('stud_1', 'u_s1', 'CS2024001', 'Computer Science', 3, 2026, 9.40, 8, 'Built open-source Kubernetes operators and distributed cache proxies', '["Go", "Kubernetes", "Docker", "Python", "Distributed Systems"]', 'https://example.com/resumes/aarav.pdf'),
('stud_2', 'u_s2', 'CS2024002', 'Computer Science', 3, 2026, 9.15, 6, 'Published paper on vision transformers and low-rank adaptation', '["Python", "PyTorch", "Deep Learning", "TensorFlow", "Algorithms"]', 'https://example.com/resumes/priya.pdf'),
('stud_3', 'u_s3', 'IT2024003', 'Information Technology', 3, 2026, 8.85, 6, 'Full stack web intern at SaaS startup; built high-traffic GraphQL APIs', '["TypeScript", "React", "Node.js", "SQL", "Azure"]', 'https://example.com/resumes/rohan.pdf'),
('stud_4', 'u_s4', 'CS2024004', 'Computer Science', 3, 2026, 8.90, 7, 'Backend developer specializing in event-driven Java Spring services', '["Java", "Spring Boot", "AWS", "Data Structures", "DynamoDB"]', 'https://example.com/resumes/ananya.pdf'),
('stud_5', 'u_s5', 'AI2024005', 'Artificial Intelligence & Data Science', 3, 2026, 9.05, 5, 'Researched real-time video super-resolution with OpenCV & PyTorch', '["Python", "PyTorch", "Computer Vision", "OpenCV", "Machine Learning"]', 'https://example.com/resumes/kabir.pdf'),
('stud_6', 'u_s6', 'CS2024006', 'Computer Science', 3, 2026, 8.40, 4, 'Frontend specialist, open-source contributor to React component libraries', '["React", "TypeScript", "Next.js", "Tailwind CSS", "Web Standards"]', 'https://example.com/resumes/ishita.pdf'),
('stud_7', 'u_s7', 'EC2024007', 'Electronics & Communication', 3, 2026, 8.10, 4, 'Engineered cloud automated testing rigs on AWS with Terraform and Bash', '["Linux", "AWS", "Terraform", "Docker", "Bash"]', 'https://example.com/resumes/aditya.pdf'),
('stud_8', 'u_s8', 'IT2024008', 'Information Technology', 3, 2026, 8.25, 4, 'Data engineering projects using Spark streaming and PostgreSQL lakehouses', '["Python", "SQL", "Spark", "Data Modeling", "PowerBI"]', 'https://example.com/resumes/sneha.pdf'),
('stud_9', 'u_s9', 'CS2024009', 'Computer Science', 3, 2026, 8.60, 5, 'Distributed systems student researcher; container networking projects', '["Go", "Docker", "Kubernetes", "Linux", "Python"]', 'https://example.com/resumes/vikram.pdf'),
('stud_10', 'u_s10', 'AI2024010', 'Artificial Intelligence & Data Science', 3, 2026, 8.70, 4, 'Designed predictive analytics dashboards and natural language pipelines', '["Python", "SQL", "PyTorch", "Data Modeling", "Machine Learning"]', 'https://example.com/resumes/neha.pdf'),
('stud_11', 'u_s11', 'CS2024011', 'Computer Science', 3, 2026, 8.35, 4, 'Java developer with Spring Boot and relational database design experience', '["Java", "Spring Boot", "SQL", "AWS", "Data Structures"]', 'https://example.com/resumes/arjun.pdf'),
('stud_12', 'u_s12', 'IT2024012', 'Information Technology', 3, 2026, 7.95, 3, 'Built interactive dashboards and serverless web tools with Next.js', '["React", "TypeScript", "Tailwind CSS", "Node.js", "SQL"]', 'https://example.com/resumes/tanvi.pdf'),
('stud_13', 'u_s13', 'EC2024013', 'Electronics & Communication', 3, 2026, 7.80, 4, 'Designed embedded IoT sensor gateways with FreeRTOS and ESP32', '["Embedded C", "Microcontrollers", "RTOS", "IoT", "Sensors"]', 'https://example.com/resumes/siddharth.pdf'),
('stud_14', 'u_s14', 'AI2024014', 'Artificial Intelligence & Data Science', 3, 2026, 8.50, 4, 'Image recognition models for medical tomography using OpenCV & CNNs', '["C++", "OpenCV", "Python", "Computer Vision", "Machine Learning"]', 'https://example.com/resumes/divya.pdf'),
('stud_15', 'u_s15', 'CS2024015', 'Computer Science', 3, 2026, 7.60, 2, 'Cloud enthusiast with hands-on Linux system administration projects', '["Linux", "AWS", "Docker", "Python", "SQL"]', 'https://example.com/resumes/varun.pdf'),
('stud_16', 'u_s16', 'IT2024016', 'Information Technology', 3, 2026, 7.45, 2, 'Modern enterprise web applications with Spring Boot and Vue.js', '["Java", "Spring", "SQL", "JavaScript", "HTML"]', 'https://example.com/resumes/pooja.pdf'),
('stud_17', 'u_s17', 'EC2024017', 'Electronics & Communication', 3, 2026, 7.30, 2, 'Firmware developer working on CAN bus protocols and STM32 boards', '["Embedded C", "Microcontrollers", "RTOS", "IoT", "Sensors"]', 'https://example.com/resumes/kunal.pdf'),
('stud_18', 'u_s18', 'ME2024018', 'Mechanical Engineering', 3, 2026, 7.10, 1, 'Robotics kinematics simulation and smart factory sensor networks', '["IoT", "Embedded C", "Microcontrollers", "Sensors", "Python"]', 'https://example.com/resumes/riya.pdf'),
('stud_19', 'u_s19', 'CS2024019', 'Computer Science', 3, 2026, 6.90, 1, 'Core Java backend developer with foundational relational database skills', '["Java", "SQL", "HTML", "JavaScript", "Spring"]', 'https://example.com/resumes/gaurav.pdf'),
('stud_20', 'u_s20', 'ME2024020', 'Mechanical Engineering', 3, 2026, 6.75, 1, 'Automation engineering and industrial telemetry monitoring', '["SQL", "Java", "HTML", "JavaScript", "Spring"]', 'https://example.com/resumes/meera.pdf');

-- 5. INSERT REALISTIC STUDENT PREFERENCES (1..N Ranking)
INSERT INTO preferences (id, student_id, internship_id, rank) VALUES
-- Student 1 (Top Cloud candidate)
('p_1_1', 'stud_1', 'int_g_cloud', 1),
('p_1_2', 'stud_1', 'int_amz_sde', 2),
('p_1_3', 'stud_1', 'int_ms_fullstack', 3),

-- Student 2 (Top AI candidate)
('p_2_1', 'stud_2', 'int_g_ai', 1),
('p_2_2', 'stud_2', 'int_adb_cv', 2),
('p_2_3', 'stud_2', 'int_g_cloud', 3),

-- Student 3 (Full stack candidate)
('p_3_1', 'stud_3', 'int_ms_fullstack', 1),
('p_3_2', 'stud_3', 'int_adb_frontend', 2),
('p_3_3', 'stud_3', 'int_amz_sde', 3),

-- Student 4 (Amazon SDE preferred)
('p_4_1', 'stud_4', 'int_amz_sde', 1),
('p_4_2', 'stud_4', 'int_ms_fullstack', 2),
('p_4_3', 'stud_4', 'int_g_cloud', 3),

-- Student 5 (AI / Vision specialist)
('p_5_1', 'stud_5', 'int_g_ai', 1),
('p_5_2', 'stud_5', 'int_adb_cv', 2),
('p_5_3', 'stud_5', 'int_ms_data', 3),

-- Student 6 (Frontend specialist)
('p_6_1', 'stud_6', 'int_adb_frontend', 1),
('p_6_2', 'stud_6', 'int_ms_fullstack', 2),
('p_6_3', 'stud_6', 'int_tcs_digital', 3),

-- Student 7 (DevOps / SRE specialist)
('p_7_1', 'stud_7', 'int_amz_devops', 1),
('p_7_2', 'stud_7', 'int_ms_data', 2),
('p_7_3', 'stud_7', 'int_tcs_digital', 3),

-- Student 8 (Data & Analytics)
('p_8_1', 'stud_8', 'int_ms_data', 1),
('p_8_2', 'stud_8', 'int_amz_sde', 2),
('p_8_3', 'stud_8', 'int_tcs_digital', 3),

-- Student 9 (Cloud Systems)
('p_9_1', 'stud_9', 'int_g_cloud', 1),
('p_9_2', 'stud_9', 'int_amz_devops', 2),
('p_9_3', 'stud_9', 'int_ms_fullstack', 3),

-- Student 10 (Data & Analytics)
('p_10_1', 'stud_10', 'int_ms_data', 1),
('p_10_2', 'stud_10', 'int_adb_cv', 2),
('p_10_3', 'stud_10', 'int_tcs_digital', 3),

-- Student 11 (Amazon SDE)
('p_11_1', 'stud_11', 'int_amz_sde', 1),
('p_11_2', 'stud_11', 'int_ms_fullstack', 2),
('p_11_3', 'stud_11', 'int_tcs_digital', 3),

-- Student 12 (Frontend)
('p_12_1', 'stud_12', 'int_adb_frontend', 1),
('p_12_2', 'stud_12', 'int_ms_fullstack', 2),
('p_12_3', 'stud_12', 'int_tcs_digital', 3),

-- Student 13 (IoT / Embedded)
('p_13_1', 'stud_13', 'int_tcs_embed', 1),
('p_13_2', 'stud_13', 'int_tcs_digital', 2),

-- Student 14 (Computer Vision)
('p_14_1', 'stud_14', 'int_adb_cv', 1),
('p_14_2', 'stud_14', 'int_ms_data', 2),
('p_14_3', 'stud_14', 'int_tcs_digital', 3),

-- Student 15 (DevOps)
('p_15_1', 'stud_15', 'int_amz_devops', 1),
('p_15_2', 'stud_15', 'int_tcs_digital', 2),

-- Student 16 (Enterprise IT)
('p_16_1', 'stud_16', 'int_tcs_digital', 1),

-- Student 17 (Embedded IoT)
('p_17_1', 'stud_17', 'int_tcs_embed', 1),
('p_17_2', 'stud_17', 'int_tcs_digital', 2),

-- Student 18 (Mechanical IoT)
('p_18_1', 'stud_18', 'int_tcs_embed', 1),
('p_18_2', 'stud_18', 'int_tcs_digital', 2),

-- Student 19 (Digital IT)
('p_19_1', 'stud_19', 'int_tcs_digital', 1),

-- Student 20 (Digital IT)
('p_20_1', 'stud_20', 'int_tcs_digital', 1);
