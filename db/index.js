var connection = require("./connection.js");
class Queries {
    constructor(connection) {
        this.connection = connection
    }
    findAllEmployees() {
        return this.connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;")
        

    }
    findAllRoles() {
        return this.connection.promise().query("SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id")

    }
    findAllDepartments() {
        return this.connection.promise().query("SELECT department.id, department.name FROM department")

    }
    addDepartment(data) {
        return this.connection.promise().query("INSERT INTO department SET ?", data)

    }
    addRole(data) {
        return this.connection.promise().query("INSERT INTO role SET ?", data)

    }
    addEmployee(data) {
        return this.connection.promise().query("INSERT INTO employee SET ?", data)
    }
    updateEmployeeRole(employeeId, roleId) {
        return this.connection.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [employeeId, roleId])

    }


}
module.exports = new Queries(connection);