-- la cocotte solidaire booking DATABASE CREATION
-- CREATE DATABASE cocotte_booking;

USE cocotte_booking;

-- users TABLE CREATION
CREATE TABLE users (
  id_user INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(255),
  birthday DATETIME,
  gender VARCHAR(255),
  member_id INT,
  member_active BOOLEAN,
  membership_date_last DATETIME,
  membership_place VARCHAR(255),
  adress VARCHAR(255),
  zip INT,
  city VARCHAR(255),
  neighborhood BOOLEAN,
  image_copyright BOOLEAN,
  mailing_active BOOLEAN,
  anonym BOOLEAN
);

-- mock datas for users TABLE
INSERT INTO cocotte_booking.users 
  (firstname, lastname, email, phone, birthday, gender, member_id, member_active, membership_date_last, membership_place, adress, zip, city, neighborhood, image_copyright, mailing_active, anonym)
VALUES
  ('mmmmmmmm', 'SSSSSSSS', 'mmmmmmmm@gmail.com', '0644332211', NOW(), 'female', 550066, true, NOW(), 'la cocotte solidaire', '1 avenue Albert Einstein', 44300, 'Nantes', true, true, false, false),
  ('cccccccc', 'GGGGGGG', 'cccccccc@gmail.com', '0644332211', NOW(), 'male', 550066, false, NOW(), 'la cocotte solidaire', '1 avenue Albert Loupe', 44300, 'Nantes', true, true, false, false),
  ('aaaaaaa', 'RRRRRRRRR', 'aaaaaaa@gmail.com', '0644332211', NOW(), 'female', 550066, true, NOW(), 'la cocotte solidaire', '1 avenue Albert Deux', 44300, 'Nantes', true, true, false, false),
  ('tttttttt', 'OOOOOOO', 'tttttttt@gmail.com', '0644332211', NOW(), 'male', 550066, false, NOW(), 'la cocotte solidaire', '1 avenue Albert II', 44300, 'Nantes', true, true, false, false);
  
-- controls
SELECT firstname, lastname, email, phone, birthday, gender, anonym FROM users;
SELECT  member_id, member_active, membership_date_last, membership_place, adress, zip, city, neighborhood, image_copyright, mailing_active FROM users;

-- activities TABLE CREATION
CREATE TABLE activities(
  id_activity INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR(255),
  description VARCHAR(255),
  picture VARCHAR(255)
);

-- mock datas for activities TABLE
INSERT INTO cocotte_booking.activities 
  (name, description, picture)
VALUES
  ('poterie', "la poterie c\'est genial!", "https://placekitten.com/640/360"),
  ('manger', "manger à la bonne franquette ce que vos voisins ont cuisiné le matin même", "https://placekitten.com/640/360"),
  ('cuisiner & manger', "cuisiner le matin et partager avec vos voisins votre création culinaire", "https://placekitten.com/640/360");

-- controls
SELECT id_activity, name, description FROM activities;
SELECT id_activity, name, picture FROM activities;


-- events TABLE CREATION + foreign keys
CREATE TABLE events (
  id_event INT NOT NULL AUTO_INCREMENT,
  date_b DATETIME,
  date_e DATETIME,
  name VARCHAR(255),
  capacity INT,
  adress VARCHAR(255),
  activity_id INT,
  PRIMARY KEY (id_event),
  FOREIGN KEY (activity_id) REFERENCES activities(id_activity)
);


-- mock datas for events TABLE
INSERT INTO cocotte_booking.events 
  (date_b, date_e, name, capacity, adress, activity_id)
VALUES
  (NOW(),NOW(), "manger", 30, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 2),
  (NOW(),NOW(), "cuisiner & manger", 10, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 3),
  (NOW(),NOW(), "poterie", 8, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 1),
  (NOW(),NOW(), "manger", 30, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 2),
  (NOW(),NOW(), "cuisiner & manger", 10, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 3),
  (NOW(),NOW(), "poterie", 8, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 1);

-- controls
SELECT * FROM events;


-- registrations (bookings) TABLE CREATION + foreign keys
CREATE TABLE registrations (
  id_registration INT NOT NULL AUTO_INCREMENT,
  quantity_adult INT,
  quantity_children INT,
  allergie VARCHAR(255),
  comment VARCHAR(255),
  user_id INT,
  event_id INT,
  PRIMARY KEY (id_registration),
  FOREIGN KEY (user_id) REFERENCES users(id_user),
  FOREIGN KEY (event_id) REFERENCES events(id_event)
);

-- mock datas for registrations TABLE
INSERT INTO cocotte_booking.registrations (quantity_adult, quantity_children, allergie, comment, user_id, event_id)
VALUES
  (2, 2, " ", "besoin d'1 chaise bébé", 1, 4),
  (3, 0, " ", " ", 2, 4),
  (1, 0, "cacahuètes", " ", 3, 4),
  (1, 0, " ", " ", 4, 6),
  (3, 0, " ", " ", 1, 6),
  (1, 0, " ", " ", 2, 2);

