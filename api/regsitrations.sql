SELECT events.*, registrations.*, users.*
FROM registrations 
JOIN events ON registrations.event_id = events.id_event
  JOIN users ON registrations.user_id = users.id_user;