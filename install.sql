CREATE DATABASE cocotte_booking;

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
  address_user VARCHAR(255),
  zip INT,
  city VARCHAR(255),
  neighborhood BOOLEAN,
  image_copyright BOOLEAN,
  mailing_active BOOLEAN,
  anonym BOOLEAN
);

-- mock datas for users TABLE
INSERT INTO cocotte_booking.users 
  (firstname, lastname, email, phone, birthday, gender, member_id, member_active, membership_date_last, membership_place, address_user, zip, city, neighborhood, image_copyright, mailing_active, anonym)
VALUES
  ('maelenn', 'sallic', '', '0677251296', NOW(), 'female', 550066, true, NOW(), 'la cocotte solidaire', '1 avenue Albert Einstein', 44300, 'Nantes', true, true, false, false),
  ('cedric', 'gardianot', 'cedric@gmail.com', '0655983322', NOW(), 'male', 550067, false, NOW(), 'la cocotte solidaire', '1 avenue Albert Loupe', 44300, 'Nantes', true, true, false, false),
  ('aurelia', 'roumesy', 'aurelia@gmail.com', '', NOW(), 'female', 550068, true, NOW(), 'la cocotte solidaire', '1 avenue Albert Deux', 44300, 'Nantes', true, true, false, false),
  ('tristan', 'olivier', 'tristan@gmail.com', '0655983322', NOW(), 'male', 550069, false, NOW(), 'la cocotte solidaire', '1 avenue Albert II', 44300, 'Nantes', true, true, false, false);
  
-- controls
SELECT firstname, lastname, email, phone, birthday, gender, anonym FROM users;
SELECT  member_id, member_active, membership_date_last, membership_place, address_user, zip, city, neighborhood, image_copyright, mailing_active FROM users;

-- activities TABLE CREATION
CREATE TABLE activities(
  id_activity INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name_activity VARCHAR(255),
  description_activity VARCHAR(255),
  picture_activity VARCHAR(255)
);

-- mock datas for activities TABLE
INSERT INTO cocotte_booking.activities 
  (name_activity, description_activity, picture_activity)
VALUES
  ('manger', "manger à la bonne franquette ce que vos voisins ont cuisiné le matin même", "http://www.canalvie.com/polopoly_fs/1.2710754.1498075197!/image/manger-ensemble.jpg_gen/derivatives/cvlandscape_670_377/manger-ensemble.jpg"),
  ('cuisiner & manger', "cuisiner le matin et partager avec vos voisins votre création culinaire", "https://previews.123rf.com/images/rawpixel/rawpixel1605/rawpixel160502810/56123886-amis-cuisine-cuisine-salle-%C3%A0-manger-ensemble-concept.jpg"),
  ('Autre', null, null),
  ('poterie', "la poterie c\'est genial!", "https://www.neuillysurmarne.fr/wp-content/uploads/2015/10/poterie.jpg");
-- controls
SELECT id_activity, name_activity, description_activity FROM activities;
SELECT id_activity, name_activity, picture_activity FROM activities;


-- events TABLE CREATION + foreign keys
CREATE TABLE events (
  id_event INT NOT NULL AUTO_INCREMENT,
  date_b DATETIME,
  date_e DATETIME,
  name_event VARCHAR(255),
  capacity INT,
  address_event VARCHAR(255),
  description_event VARCHAR(255),
  picture_event VARCHAR(255),
  activity_id INT,
  PRIMARY KEY (id_event),
  FOREIGN KEY (activity_id) REFERENCES activities(id_activity)
);


-- mock datas for events TABLE
INSERT INTO cocotte_booking.events 
  (date_b, date_e, name_event, capacity, address_event, activity_id, description_event, picture_event)

VALUES
  ("2019-10-31 12:15:00", "2019-10-31 13:45:00", "manger", 30, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 1, "manger à la bonne franquette ce que vos voisins ont cuisiné le matin même", "http://www.canalvie.com/polopoly_fs/1.2710754.1498075197!/image/manger-ensemble.jpg_gen/derivatives/cvlandscape_670_377/manger-ensemble.jpg"),
  ("2019-09-14 09:15:00", "2019-09-14 13:45:00", "cuisiner & manger", 10, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 2, "cuisiner le matin et partager avec vos voisins votre création culinaire", "https://previews.123rf.com/images/rawpixel/rawpixel1605/rawpixel160502810/56123886-amis-cuisine-cuisine-salle-%C3%A0-manger-ensemble-concept.jpg"),
  ("2019-09-14 14:00:00", "2019-09-14 18:00:00", "poterie", 8, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 4, "la poterie c\'est genial!", "https://www.neuillysurmarne.fr/wp-content/uploads/2015/10/poterie.jpg"),
  ("2019-09-14 12:15:00", "2019-09-14 13:45:00", "manger", 30, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 1, "manger à la bonne franquette ce que vos voisins ont cuisiné le matin même", "http://www.canalvie.com/polopoly_fs/1.2710754.1498075197!/image/manger-ensemble.jpg_gen/derivatives/cvlandscape_670_377/manger-ensemble.jpg"),
  ("2019-09-21 09:15:00", "2019-09-21 13:45:00", "cuisiner & manger", 10, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 2, "cuisiner le matin et partager avec vos voisins votre création culinaire", "https://previews.123rf.com/images/rawpixel/rawpixel1605/rawpixel160502810/56123886-amis-cuisine-cuisine-salle-%C3%A0-manger-ensemble-concept.jpg"),
  ("2019-09-21 09:15:00", "2019-09-21 13:45:00", "cuisiner & manger", 10, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 2, "cuisiner le matin et partager avec vos voisins votre création culinaire", "https://previews.123rf.com/images/rawpixel/rawpixel1605/rawpixel160502810/56123886-amis-cuisine-cuisine-salle-%C3%A0-manger-ensemble-concept.jpg"),
  ("2019-06-10 09:15:00", "2019-06-10 13:45:00", "cuisiner & manger", 10, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 2, "cuisiner le matin et partager avec vos voisins votre création culinaire", "https://previews.123rf.com/images/rawpixel/rawpixel1605/rawpixel160502810/56123886-amis-cuisine-cuisine-salle-%C3%A0-manger-ensemble-concept.jpg"),
  ("2019-06-10 09:15:00", "2019-06-10 13:45:00", "cuisiner & manger", 10, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 2, "cuisiner le matin et partager avec vos voisins votre création culinaire", "https://previews.123rf.com/images/rawpixel/rawpixel1605/rawpixel160502810/56123886-amis-cuisine-cuisine-salle-%C3%A0-manger-ensemble-concept.jpg"),
  ("2019-06-20 09:15:00", "2019-06-20 13:45:00", "manger", 10, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 1, "cuisiner le matin et partager avec vos voisins votre création culinaire", "https://previews.123rf.com/images/rawpixel/rawpixel1605/rawpixel160502810/56123886-amis-cuisine-cuisine-salle-%C3%A0-manger-ensemble-concept.jpg"),
  ("2019-07-20 09:15:00", "2019-07-20 13:45:00", "cuisiner & manger", 10, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 2, "cuisiner le matin et partager avec vos voisins votre création culinaire", "https://previews.123rf.com/images/rawpixel/rawpixel1605/rawpixel160502810/56123886-amis-cuisine-cuisine-salle-%C3%A0-manger-ensemble-concept.jpg"),
  ("2019-07-20 12:15:00", "2019-07-20 13:45:00", "manger", 10, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 1, "cuisiner le matin et partager avec vos voisins votre création culinaire", "https://previews.123rf.com/images/rawpixel/rawpixel1605/rawpixel160502810/56123886-amis-cuisine-cuisine-salle-%C3%A0-manger-ensemble-concept.jpg"),
  (NOW(), NOW(), "manger", 10, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 1, "cuisiner le matin et partager avec vos voisins votre création culinaire", "https://previews.123rf.com/images/rawpixel/rawpixel1605/rawpixel160502810/56123886-amis-cuisine-cuisine-salle-%C3%A0-manger-ensemble-concept.jpg"),
  (NOW(), NOW(), "cuisiner & manger", 10, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 2, "cuisiner le matin et partager avec vos voisins votre création culinaire", "https://previews.123rf.com/images/rawpixel/rawpixel1605/rawpixel160502810/56123886-amis-cuisine-cuisine-salle-%C3%A0-manger-ensemble-concept.jpg"),
  ("2019-10-13 14:00:00", "2019-10-13 18:00:00", "poterie", 8, "la cocotte solidaire - ile de versailles 44000 Nantes. Tram 2 - arret 'motte rouge' ", 4, "la poterie c\'est genial!", "https://www.neuillysurmarne.fr/wp-content/uploads/2015/10/poterie.jpg")
  ;

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
  (1, 0, "fruits de mer", " ", 4, 6),
  (3, 0, " ", "fauteuil roulant", 1, 6),
  (1, 0, "échalottes", " ", 2, 2),
  (1, 0, " ", " ", 4, 6),
  (3, 0, " ", " ", 1, 6),
  (2, 2, " ", "besoin d'1 chaise bébé", 1, 2),
  (3, 0, " ", " ", 2, 2),
  (1, 0, "cacahuètes", " ", 3, 2),
  (1, 0, "fruits de mer", " ", 4, 2),
  (3, 0, " ", "fauteuil roulant", 1, 2),
  (1, 0, " ", " ", 2, 2);

CREATE TABLE admins (
  id_admin INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255)
);

INSERT INTO cocotte_booking.admins 
  (email, password, name)
VALUES
  ('toto@gmail.com', 'toto', 'toto');
