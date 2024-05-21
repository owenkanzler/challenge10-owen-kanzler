const inquirer = require("inquirer");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "password",
  host: "localhost",
  database: "challenge10_db",
});

console.log(`Connected to the challenge10_db database.`);

const mainMenu = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Exit":
          pool.end();
          console.log("Goodbye!");
          break;
      }
    });
};

const viewAllDepartments = () => {
  pool.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    mainMenu();
  });
};

const viewAllRoles = () => {
  const query = `
    SELECT employee_role.role_id, employee_role.title, department.department_name AS department, employee_role.salary 
    FROM employee_role 
    JOIN department ON employee_role.department_id = department.department_id`;
  pool.query(query, (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    mainMenu();
  });
};

const viewAllEmployees = () => {
  const query = `
    SELECT employee.employee_id, employee.first_name, employee.last_name, employee_role.title, department.department_name AS department, employee_role.salary, 
    COALESCE(manager.first_name || ' ' || manager.last_name, 'None') AS manager
    FROM employee
    JOIN employee_role ON employee.role_id = employee_role.role_id
    JOIN department ON employee_role.department_id = department.department_id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.employee_id`;
  pool.query(query, (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    mainMenu();
  });
};

const addDepartment = () => {
  inquirer
    .prompt({
      name: "department_name",
      type: "input",
      message: "Enter the name of the department:",
    })
    .then((answer) => {
      pool.query(
        "INSERT INTO department (department_name) VALUES ($1)",
        [answer.department_name],
        (err, res) => {
          if (err) throw err;
          console.log("Department added!");
          mainMenu();
        }
      );
    });
};

const addRole = () => {
  pool.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    const departments = res.rows.map((department) => ({
      name: department.department_name,
      value: department.department_id,
    }));
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter the title of the role:",
        },
        {
          name: "salary",
          type: "input",
          message: "Enter the salary for the role:",
        },
        {
          name: "department_id",
          type: "list",
          message: "Select the department for the role:",
          choices: departments,
        },
      ])
      .then((answer) => {
        pool.query(
          "INSERT INTO employee_role (title, salary, department_id) VALUES ($1, $2, $3)",
          [answer.title, answer.salary, answer.department_id],
          (err, res) => {
            if (err) throw err;
            console.log("Role added!");
            mainMenu();
          }
        );
      });
  });
};

const addEmployee = () => {
  pool.query("SELECT * FROM employee_role", (err, res) => {
    if (err) throw err;
    const roles = res.rows.map((role) => ({
      name: role.title,
      value: role.role_id,
    }));
    pool.query("SELECT * FROM employee", (err, res) => {
      if (err) throw err;
      const managers = res.rows.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.employee_id,
      }));
      managers.push({ name: "None", value: null });
      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: "Enter the first name of the employee:",
          },
          {
            name: "last_name",
            type: "input",
            message: "Enter the last name of the employee:",
          },
          {
            name: "role_id",
            type: "list",
            message: "Select the role for the employee:",
            choices: roles,
          },
          {
            name: "manager_id",
            type: "list",
            message: "Select the manager for the employee:",
            choices: managers,
          },
        ])
        .then((answer) => {
          pool.query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
            [
              answer.first_name,
              answer.last_name,
              answer.role_id,
              answer.manager_id,
            ],
            (err, res) => {
              if (err) throw err;
              console.log("Employee added!");
              mainMenu();
            }
          );
        });
    });
  });
};

const updateEmployeeRole = () => {
  pool.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    const employees = res.rows.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.employee_id,
    }));
    pool.query("SELECT * FROM employee_role", (err, res) => {
      if (err) throw err;
      const roles = res.rows.map((role) => ({
        name: role.title,
        value: role.role_id,
      }));
      inquirer
        .prompt([
          {
            name: "employee_id",
            type: "list",
            message: "Select the employee to update:",
            choices: employees,
          },
          {
            name: "role_id",
            type: "list",
            message: "Select the new role for the employee:",
            choices: roles,
          },
        ])
        .then((answer) => {
          pool.query(
            "UPDATE employee SET role_id = $1 WHERE employee_id = $2",
            [answer.role_id, answer.employee_id],
            (err, res) => {
              if (err) throw err;
              console.log("Employee role updated!");
              mainMenu();
            }
          );
        });
    });
  });
};

mainMenu();
