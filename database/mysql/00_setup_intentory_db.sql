CREATE DATABASE IF NOT EXISTS nutriconplus_inventory_db;

CREATE USER IF NOT EXISTS 'app_inventory_db'@'localhost'
IDENTIFIED BY '123456';

GRANT ALL PRIVILEGES ON nutriconplus_inventory_db.*
TO 'app_inventory_db'@'localhost';

FLUSH PRIVILEGES;