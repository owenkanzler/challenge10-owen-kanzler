DROP DATABASE IF EXISTS challenge10_db;
CREATE DATABASE challenge10_db;

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(30)
);

CREATE TABLE employee_role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(10, 2),
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES employee_role(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);
