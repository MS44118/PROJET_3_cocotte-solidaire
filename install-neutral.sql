
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
  ('Autre', null, null);

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


CREATE TABLE admins (
  id_admin INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255)
);

