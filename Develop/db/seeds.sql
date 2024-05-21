INSERT INTO department (department_name)
VALUES ('Engineering'),
       ('Finance'),
       ('Legal'),
       ('Sales');

INSERT INTO employee_role (title, salary, department_id)
VALUES ('Software Engineer', 100000, 1),
       ('Accountant', 75000, 2),
       ('Lawyer', 90000, 3),
       ('Sales Lead', 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Owen', 'Kanzler', 1, NULL),
       ('John', 'Doe', 2, 1),
       ('Jane', 'Doe', 3, 1),
       ('Mary', 'Johnson', 4, 1);
