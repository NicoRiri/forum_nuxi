-- Adminer 4.8.1 MySQL 11.1.2-MariaDB-1:11.1.2+maria~ubu2204 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `Forums`;
CREATE TABLE `Forums` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `Messages`;
CREATE TABLE `Messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sujet_id` int(11) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `contenu` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sujet_id` (`sujet_id`),
  CONSTRAINT `Messages_ibfk_1` FOREIGN KEY (`sujet_id`) REFERENCES `Sujets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `Sujets`;
CREATE TABLE `Sujets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `forum_id` int(11) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `message_initial` text DEFAULT NULL,
  `date` timestamp NOT NULL,
  `auteur` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `forum_id` (`forum_id`),
  CONSTRAINT `Sujets_ibfk_1` FOREIGN KEY (`forum_id`) REFERENCES `Forums` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `admin` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `Users` (`id`, `nom`, `password`, `admin`) VALUES
(1,	'admin',	'$2b$10$zQ.xJeny0nwURgnFJYoii.nqumcztLnYvFdld.sYbmT.q/vXEETMS',	CONV('1', 2, 10) + 0);

-- 2024-04-21 15:21:12
