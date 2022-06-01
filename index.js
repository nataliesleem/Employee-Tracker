var inquirer = require("inquirer");
const { listenerCount } = require("process");
var db = require("./db");
require("console.table");


const menu = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["View All Employees", "View All Roles", "View All Departments", "Create Employee", "Create Role", "Create Department", "Update Employee Role", "Quit"]

        }
    ]).then(res => {
        switch (res.choice) {
            case "View All Employees": 
            viewEmployees();
            break

            case "View All Roles":
            viewRoles();
            break

            case "View All Departments":
            viewDepartments();
            break

            case "Create Employee":
            createEmployee();
            break

            case "Create Role":
            createRole();
            break

            case "Create Department":
            addDepartment();
            break
            
            case "Update Employee Role":
            updateEmployeeRole();
            break

            default:
            quit();
        
        }

    });
};
const createEmployee = () => {
    inquirer.prompt([
        {
            name: "firstName",
            message: "What is the employee's first name?"
        },
        {
            name: "lastName",
            message: "What is the employee's last name?"
        },
]).then(res => {
    var firstName = res.firstName
    var lastName = res.lastName
    db.findAllRoles().then(([rows]) => {
        let roles = rows
        var roleChoices = roles.map(({id, title}) => {
            return{name: title, value: id}
        })
        inquirer.prompt(
            {
                type: "list",
                name: "roleId",
                message: "What is the employee's role?",
                choices: roleChoices
            }
        ).then(res => {
        var roleId = res.roleId
        db.findAllEmployees().then(([rows]) => {
            let employees = rows
            var managerChoices = employees.map(({id, first_name, last_name}) => {
                return{name: first_name + " " + last_name, value: id}
            })
            inquirer.prompt(
                { type: "list",
                  name: "managerId",
                  message: "Who is the employee's manager?",
                  choices: managerChoices
                }
            ).then(res => {
                var employee = {
                    manager_id: res.managerId,
                    role_id: roleId,
                    first_name: firstName,
                    last_name: lastName
                }
                console.log(employee)
                db.addEmployee(employee).then(res => {
                    menu();
                })
            })
        })
    })
})
})


}
const viewEmployees = () => {
    db.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      console.log("\n");
      console.table(employees);
    })
    .then(() => menu());
}
function viewDepartments() {
    db.findAllDepartments()
      .then(([rows]) => {
        let departments = rows;
        console.log("\n");
        console.table(departments);
      })
      .then(() => menu());
  }

function viewRoles() {
  db.findAllRoles()
    .then(([rows]) => {
      let roles = rows;
      console.log("\n");
      console.table(roles);
    })
    .then(() => menu());
}
function addDepartment() {
    inquirer.prompt([
      {
        name: "name",
        message: "What is the name of the department?"
      }
    ])
      .then(res => {
        let name = res;
        db.addDepartment(name)
          .then(() => console.log(`Added ${name.name} to the database`))
          .then(() => menu())
      })
  }
  function createRole() {
    db.findAllDepartments()
      .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
          name: name,
          value: id
        }));
  
        inquirer.prompt([
          {
            name: "title",
            message: "What is the name of the role?"
          },
          {
            name: "salary",
            message: "What is the salary of the role?"
          },
          {
            type: "list",
            name: "department_id",
            message: "Which department does the role belong to?",
            choices: departmentChoices
          }
        ])
          .then(role => {
            db.addRole(role)
              .then(() => console.log(`Added ${role.title} to the database`))
              .then(() => menu())
          })
      })
  }
  function updateEmployeeRole() {
    db.findAllEmployees()
      .then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id
        }));
  
        inquirer.prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee's role do you want to update?",
            choices: employeeChoices
          }
        ])
          .then(res => {
            let employeeId = res.employeeId;
            db.findAllRoles()
              .then(([rows]) => {
                let roles = rows;
                const roleChoices = roles.map(({ id, title }) => ({
                  name: title,
                  value: id
                }));
  
                inquirer.prompt([
                  {
                    type: "list",
                    name: "roleId",
                    message: "Which role do you want to assign the selected employee?",
                    choices: roleChoices
                  }
                ])
                  .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                  .then(() => console.log("Updated employee's role"))
                  .then(() => menu())
              });
          });
      })
  }
  function quit() {
    console.log("Goodbye!");
    process.exit();
  }
menu();