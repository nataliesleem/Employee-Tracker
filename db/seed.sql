USE employee_db;
INSERT INTO department(name)
VALUES("Sales"), ("Legal"), ("Finances");
INSERT INTO role(title, salary, department_id)
VALUES("Salesperson", 80000, 1), ("Manager", 100000, 2), ("Janitor", 50000, 3);
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Name1", "Last1", 1, NULL), ("Name2", "Last2", 2, NULL);

