CREATE TABLE Forums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE Sujets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    forum_id INT,
    nom VARCHAR(255),
    message_initial TEXT,
    FOREIGN KEY (forum_id) REFERENCES Forums(id)
);

CREATE TABLE Messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sujet_id INT,
    timestamp TIMESTAMP,
    user_id INT,
    contenu TEXT,
    FOREIGN KEY (sujet_id) REFERENCES Sujets(id)
);
