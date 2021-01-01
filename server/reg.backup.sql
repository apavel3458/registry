-- MySQL dump 10.13  Distrib 5.7.23, for macos10.13 (x86_64)
--
-- Host: localhost    Database: registry
-- ------------------------------------------------------
-- Server version	5.7.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `devices` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `patientId` int(10) unsigned DEFAULT NULL,
  `deviceName` varchar(255) DEFAULT NULL,
  `implantDate` date DEFAULT NULL,
  `explantDate` date DEFAULT NULL,
  `visibleDetail` varchar(255) DEFAULT NULL,
  `comments` text,
  `details` json DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `devices_patientid_index` (`patientId`),
  CONSTRAINT `devices_patientid_foreign` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES (1,3,'CRT','2019-04-04',NULL,'CRT-P','','{\"type\": \"CRT-P\"}',NULL,'2019-07-26 06:05:14','2019-07-26 06:05:14'),(2,3,'CRT','2017-06-25','2019-04-04','CRT-D','This is a CRT','{\"type\": \"CRT-D\"}',NULL,'2019-08-05 21:31:55','2019-08-05 21:31:55'),(3,7,'Pacemaker','2018-03-03',NULL,'VVI','','{\"mode\": \"VVI\"}',NULL,'2019-09-11 07:38:19','2019-09-11 07:38:19'),(4,12,'ICD','2020-03-23',NULL,'','','{}',NULL,'2020-12-31 19:47:03','2020-12-31 19:47:03');
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnoses`
--

DROP TABLE IF EXISTS `diagnoses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `diagnoses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `patientId` int(10) unsigned DEFAULT NULL,
  `diagnosisName` varchar(255) DEFAULT NULL,
  `dateStart` varchar(255) DEFAULT NULL,
  `dateEnd` varchar(255) DEFAULT NULL,
  `treatingPhysician` varchar(255) DEFAULT NULL,
  `biopsyProven` tinyint(1) DEFAULT NULL,
  `comments` text,
  `details` json DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `diagnoses_patientid_index` (`patientId`),
  CONSTRAINT `diagnoses_patientid_foreign` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=207 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnoses`
--

LOCK TABLES `diagnoses` WRITE;
/*!40000 ALTER TABLE `diagnoses` DISABLE KEYS */;
INSERT INTO `diagnoses` VALUES (1,2,'Sarcoidosis','2019-03-03','2019-03-08','Tzemos',1,'','{\"BMD\": \"1.4\", \"HTN\": true, \"DMPostCS\": true, \"NYHAatDx\": \"4\", \"VitDdate\": \"2019-03-03\", \"VitDlevel\": \"4.4\", \"renalSarcoid\": true}',NULL,'2019-07-30 17:18:55','2019-07-30 17:18:55'),(2,3,'Sarcoidosis','2019-03-03',NULL,'Tzemos',1,'Sarcoidosis patient diagnosed in St. Thomas','{\"AF\": true, \"NYHAatDx\": \"3\", \"VitDdate\": \"2019-03-03\", \"cardiacSarcoid\": true}',NULL,'2019-08-01 19:35:27','2019-08-01 19:35:27'),(3,4,'Sarcoidosis','2019-03-16',NULL,'Tzemos',1,'','{\"HTN\": true, \"DMPostCS\": true, \"NYHAatDx\": \"4\", \"VitDdate\": \"2019-03-03\", \"DMControlGood\": true, \"pulmonarySarcoid\": true}',NULL,'2019-08-05 23:33:53','2019-08-05 23:33:53'),(7,7,'Heart Failure','2012-03-03',NULL,NULL,NULL,'Sarcoidosis','{\"NYHA\": \"1\", \"type\": \"Ischemic\"}',NULL,'2019-09-11 06:16:37','2019-09-11 06:16:37'),(9,10,'Heart Failure','2018-01-01',NULL,NULL,NULL,'','{}',NULL,'2019-09-11 20:17:34','2019-09-11 20:17:34'),(10,12,'Heart Failure','2019-01-01',NULL,NULL,NULL,'','{}',NULL,'2019-09-11 20:24:19','2019-09-11 20:24:19'),(204,462,'Breast Cancer','2019-01-01',NULL,NULL,NULL,'','{\"extent\": \"Metastatic\"}',NULL,'2019-11-22 18:50:19','2019-11-22 18:50:19'),(205,13,'Heart Failure','2020-01-01',NULL,NULL,NULL,'','{\"type\": \"Ischemic\"}',NULL,'2020-12-31 18:04:44','2020-12-31 18:04:44'),(206,463,'Heart Failure',NULL,NULL,NULL,NULL,'','{\"type\": \"Ischemic\"}',NULL,'2020-12-31 18:08:00','2020-12-31 18:08:00');
/*!40000 ALTER TABLE `diagnoses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diseases`
--

DROP TABLE IF EXISTS `diseases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `diseases` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `diseaseName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diseases`
--

LOCK TABLES `diseases` WRITE;
/*!40000 ALTER TABLE `diseases` DISABLE KEYS */;
INSERT INTO `diseases` VALUES (1,'Sarcoidosis'),(2,'Malignancy'),(3,'Heart Failure');
/*!40000 ALTER TABLE `diseases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `patientId` int(10) unsigned DEFAULT NULL,
  `eventName` varchar(255) DEFAULT NULL,
  `eventDate` date DEFAULT NULL,
  `visibleDetail` varchar(255) DEFAULT NULL,
  `comments` text,
  `details` json DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `events_patientid_index` (`patientId`),
  CONSTRAINT `events_patientid_foreign` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,3,'Hospitalization','2018-03-16','Heart Failure','','{\"reason\": \"Heart Failure\"}',NULL,'2019-07-26 06:05:31','2019-07-26 06:05:31'),(2,3,'Hospitalization','2019-01-03','Heart Failure','','{\"reason\": \"Heart Failure\"}',NULL,'2019-07-26 06:07:47','2019-07-26 06:07:47'),(3,3,'ER Visit','2019-03-03','Arrhythmia','','{\"reason\": \"Arrhythmia\", \"lengthOfStay\": 5}',NULL,'2019-07-26 20:27:25','2019-07-26 20:27:25'),(4,3,'Hospitalization','2019-03-03','Heart Failure',NULL,'{\"reason\": \"Heart Failure\"}',NULL,'2019-07-26 20:37:04','2019-07-26 20:37:04'),(5,3,'Device Shock','2019-03-06','Appropriate','','{\"appropriate\": true}',NULL,'2019-07-26 20:37:20','2019-07-26 20:37:20'),(6,2,'Hospitalization','2019-03-03','Insanity','','{\"reason\": \"Insanity\"}',NULL,'2019-08-01 20:06:37','2019-08-01 20:06:37'),(7,3,'Arrhythmia','2019-03-03','Unknown','','{\"arrhythmiaType\": \"Unknown\"}',NULL,'2019-08-01 20:07:12','2019-08-01 20:07:12'),(8,3,'Hospitalization','2019-01-01','Heart Failure','','{\"reason\": \"Heart Failure\"}',NULL,'2019-08-01 20:07:34','2019-08-01 20:07:34'),(10,7,'Arrhythmia','2019-09-13','Ventricular Tachycardia','','{\"arrhythmiaType\": \"Ventricular Tachycardia\", \"hemodynamicallySignificant\": true}',NULL,'2019-09-11 07:34:44','2019-09-11 07:34:44');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imaging`
--

DROP TABLE IF EXISTS `imaging`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `imaging` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `patientId` int(10) unsigned DEFAULT NULL,
  `imagingName` varchar(255) DEFAULT NULL,
  `studyDate` date DEFAULT NULL,
  `EF` decimal(4,1) DEFAULT NULL,
  `EFtext` varchar(255) DEFAULT NULL,
  `visibleDetail` varchar(255) DEFAULT NULL,
  `comments` text,
  `details` json DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `imaging_patientid_index` (`patientId`),
  CONSTRAINT `imaging_patientid_foreign` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imaging`
--

LOCK TABLES `imaging` WRITE;
/*!40000 ALTER TABLE `imaging` DISABLE KEYS */;
INSERT INTO `imaging` VALUES (1,3,'CMR','2019-03-01',25.0,'25','LGE','This patient came in for MRI, but had shortness of breath.  Limited pictures were taken.','{\"LGE\": true, \"RVEF\": 35}',NULL,'2019-07-26 05:41:45','2019-07-26 05:41:45'),(2,3,'PET','2019-04-04',45.0,'45','FDG Uptake Focal','','{\"FDGUptakeFocal\": true, \"perfusionDefect\": true}',NULL,'2019-07-26 20:27:00','2019-07-26 20:27:00'),(3,3,'PET','2019-03-03',45.0,'45','FDG Uptake Focal','','{\"FDGUptakeFocal\": true, \"perfusionDefect\": true}',NULL,'2019-07-26 20:29:40','2019-07-26 20:29:40'),(4,3,'CMR','2019-03-03',37.5,'35-40','LGE','','{\"LGE\": true, \"RVEF\": 35}',NULL,'2019-07-26 20:30:31','2019-07-26 20:30:31'),(5,3,'Echo','2018-03-03',62.5,'60-65','First Diagnosis Echo','Severe MR, Moderate TR','{\"firstDiagnosisEcho\": true}',NULL,'2019-07-26 20:35:58','2019-07-26 20:35:58'),(8,7,'Echo','2018-03-16',37.5,'35-40','Mild','','{\"MR\": \"Moderate\", \"TR\": \"Mild\", \"RMWA\": true, \"RVFunction\": \"Mild\"}',NULL,'2019-09-11 06:22:59','2019-09-11 06:22:59'),(9,7,'Echo','2018-03-03',12.5,'10-15',NULL,'','{}',NULL,'2019-09-11 18:51:52','2019-09-11 18:51:52'),(10,7,'CMR','2018-03-03',45.0,'45','LGE','','{\"LGE\": true}',NULL,'2019-09-11 18:52:43','2019-09-11 18:52:43');
/*!40000 ALTER TABLE `imaging` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knex_migrations`
--

DROP TABLE IF EXISTS `knex_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `knex_migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations`
--

LOCK TABLES `knex_migrations` WRITE;
/*!40000 ALTER TABLE `knex_migrations` DISABLE KEYS */;
INSERT INTO `knex_migrations` VALUES (37,'20150613161239_initial_schema.js',1,'2019-07-18 01:43:22'),(41,'20190726140115_username.js',2,'2019-08-22 19:48:12'),(42,'20190822113239_multipleRegistry.js',3,'2019-08-22 19:49:15'),(44,'20190910234230_drugName.js',4,'2019-09-11 14:06:02'),(46,'20190911120809_gender.js',5,'2019-09-12 02:17:11'),(50,'20190918132756_researchId.js',6,'2019-09-20 22:41:19');
/*!40000 ALTER TABLE `knex_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knex_migrations_lock`
--

DROP TABLE IF EXISTS `knex_migrations_lock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `knex_migrations_lock` (
  `index` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `is_locked` int(11) DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations_lock`
--

LOCK TABLES `knex_migrations_lock` WRITE;
/*!40000 ALTER TABLE `knex_migrations_lock` DISABLE KEYS */;
INSERT INTO `knex_migrations_lock` VALUES (4,0);
/*!40000 ALTER TABLE `knex_migrations_lock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medications`
--

DROP TABLE IF EXISTS `medications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `medications` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `patientId` int(10) unsigned DEFAULT NULL,
  `medicationName` varchar(255) DEFAULT NULL,
  `drugClass` varchar(255) DEFAULT NULL,
  `dose` int(11) DEFAULT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `visibleDetail` varchar(255) DEFAULT NULL,
  `comments` text,
  `details` json DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `drugName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `medications_patientid_index` (`patientId`),
  CONSTRAINT `medications_patientid_foreign` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medications`
--

LOCK TABLES `medications` WRITE;
/*!40000 ALTER TABLE `medications` DISABLE KEYS */;
INSERT INTO `medications` VALUES (1,3,'Steroid','Steroid',25,'','2019-01-01',NULL,'--','This steroid was started but was then stopped shortly after.','{}',NULL,'2019-07-26 04:58:25','2019-07-26 04:58:25',NULL),(2,3,'Immunosuppressants','Immunosuppressants',NULL,'','2019-03-03',NULL,'--','','{}',NULL,'2019-07-26 05:42:08','2019-07-26 05:42:08',NULL),(3,3,'Beta Blocker','Beta Blocker',NULL,'','2017-03-03','2018-03-16','--','','{}',NULL,'2019-07-26 06:34:32','2019-07-26 06:34:32',NULL),(4,2,'Steroid','Steroid',12,'','2019-03-03',NULL,'--','','{}',NULL,'2019-08-01 20:33:51','2019-08-01 20:33:51',NULL),(7,7,'MRA','MRA',25,'mg','2019-01-01',NULL,'--',NULL,'{}',NULL,'2019-09-11 06:56:43','2019-09-11 06:56:43','Spironolactone'),(8,7,'Beta Blocker','Beta Blocker',50,'mg','2019-01-01',NULL,'--',NULL,NULL,NULL,'2019-09-11 07:30:34','2019-09-11 07:30:34','Atenolol');
/*!40000 ALTER TABLE `medications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patients` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `registryId` int(10) unsigned DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `mrn` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `deceasedDate` date DEFAULT NULL,
  `causeOfDeath` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gender` varchar(255) DEFAULT NULL,
  `studyId` varchar(255) DEFAULT NULL,
  `middleName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `patients_registryid_index` (`registryId`),
  CONSTRAINT `patients_registryid_foreign` FOREIGN KEY (`registryId`) REFERENCES `registries` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=464 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES (1,1,'Barak','Obama','1003033','1960-03-03',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-07-17 21:43:26','2019-07-13 05:38:08',NULL,NULL,NULL),(2,1,'Trump','Donald','103020','1956-02-15',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-07-17 21:43:26','2019-07-14 14:28:38',NULL,NULL,NULL),(3,1,'Dogbert','Billy','1040202','1984-10-18',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-07-17 21:43:26','2019-07-14 14:29:26',NULL,NULL,NULL),(4,1,'Smith','Jonathan','2130003','1967-05-18','2019-06-06','Unknown','Antiperovitch, Pavel','Antiperovitch, Pavel','2019-08-05 23:26:42','2019-08-05 23:26:42',NULL,NULL,NULL),(7,3,'Yields','John','1030202','1982-03-03',NULL,NULL,NULL,NULL,'2019-09-11 06:05:26','2019-09-11 06:05:26',NULL,NULL,NULL),(8,3,'Smith','John',NULL,'2017-01-01',NULL,NULL,NULL,NULL,'2019-09-11 20:09:29','2019-09-11 20:09:29','M',NULL,NULL),(9,3,'Zinger','Dam',NULL,'1970-10-10',NULL,NULL,NULL,NULL,'2019-09-11 20:11:50','2019-09-11 20:11:50','F',NULL,NULL),(10,3,'Ringer','Lactate',NULL,'2019-03-03',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-09-11 20:13:52','2019-09-11 20:13:52','M',NULL,NULL),(11,3,'Adam','Sam','1213131','1983-03-03',NULL,NULL,'Antiperovitch, Pavel','Antiperovitch, Pavel','2019-09-11 20:17:13','2019-09-11 20:17:13','M','2323',NULL),(12,3,'Antip','Man','12125256','2018-01-01',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-09-11 20:24:08','2019-09-11 20:24:08','M',NULL,NULL),(13,3,'Adams','Zane','1241241','2019-01-01',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-09-11 20:24:38','2019-09-11 20:24:38','F',NULL,NULL),(14,3,'Zane','Adam',NULL,'2019-01-01',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-09-11 20:38:59','2019-09-11 20:38:59','M',NULL,NULL),(238,2,'Knight','Laurane','11074294','1957-07-10',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR2','Frances'),(239,2,'Allen-Dacosta','Patricia','10506050','1977-09-10',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR1','Carlotta'),(240,2,'Armstrong','Deborah','12093732','1962-01-17',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR3','Marie'),(241,2,'Zylawy','Theresa','10275664','1953-04-28',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR4','Wanda'),(242,2,'Alves','Robin','12098153','1968-01-27',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR5','Kathleen'),(243,2,'Garzon Garcia','Elva','11287499','1963-11-18',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR6','Piedad'),(244,2,'Ferguson','Penelope','11050143','1957-09-04',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR7','Lorraine'),(245,2,'Adams','Jayne','10935709','1948-04-13',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR9','Frances'),(246,2,'McArthur','Mary Jane','10725451','1952-01-19',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR11','Margaret'),(247,2,'Lucas','Meliza','12102872','1967-06-26',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR10','Quiambao'),(248,2,'Kaltenback','Karen','10039585','1965-05-20',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR12','Louise'),(249,2,'Nicholls','Renee','12085369','1971-03-17',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR13','Francoise'),(250,2,'Philip','Treasure','11206815','1981-05-22',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR14','Felicia'),(251,2,'Akimova-Vladislav',' An','11974430','1977-12-22',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR15',NULL),(252,2,'Quipp','Lorri','11090963','1963-06-11',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR16','June'),(253,2,'Garlick','Deborah','11078823','1961-11-14',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR17','Ann'),(254,2,'Horovenko','Anita','11783943','1955-02-01',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR18','Louise'),(255,2,'Mitchell','Lisa','10135657','1966-08-01',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR19','Jean'),(256,2,'Zagorodny','Mary Myra','10332562','1950-08-15',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR20','Hilda'),(257,2,'Van de Hoef','Chrystal','11438275','1975-03-09',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR21','Lorraine'),(258,2,'Fathe',' Mhdya','11498203','1981-01-12',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR22',NULL),(259,2,'Bechard','Janice','10165937','1953-12-24',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR23','Arlene'),(260,2,'Sprague','Laurie','10450865','1964-02-24',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR24','Madeline'),(261,2,'Bell','Denise','12092294','1961-12-02',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:54','2019-11-20 16:40:54',NULL,'BR25','Emmalene'),(262,2,'King','Barbara','10049729','1963-09-01',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR26','Jane'),(263,2,'Brown','Minnie','11585451','1938-01-06',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR27','May'),(264,2,'Riley','Alan','10935106','1972-05-14',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR28','Cathleen'),(265,2,'Roberts','Brenda','12112617','1960-10-31',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR29','Jane'),(266,2,'Bos','Susan','11606798','1971-04-03',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR30','Catherine'),(267,2,'Downey','Margaret','12088484','1958-01-25',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR31','Maria'),(268,2,'George','Katharine','11417639','1970-03-18',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR32','Laura'),(269,2,'Boone','Sylvia','10530707','1946-06-09',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR33','Joan'),(270,2,'Mesjarik',' MaryAnne','10791691','1953-05-01',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR34',NULL),(271,2,'Mendonca','Krysta','11799899','1984-09-14',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR35','Nicole'),(272,2,'Kettunen','Helen','11343601','1955-09-14',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR36','Margaret'),(273,2,'Underhill','Mary','11492521','1954-11-24',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR37','Ed'),(274,2,'Dendrinos','Tonya','11836242','1980-01-15',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR38','Pauline'),(275,2,'Thompson','Holly','11341851','1978-04-24',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR41','Julia'),(276,2,'Garrett','Barbara','10374481','1948-02-18',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR39','Helen'),(277,2,'Hinton','Gloria','11446684','1940-11-20',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR42','Dawn'),(278,2,'Eskritt','Gail','10391173','1960-01-04',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR43','Elizabeth'),(279,2,'Ragalyi','Sarah','11769284','1946-04-15',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR44','Lucian'),(280,2,'Howgego','Linda','11970177','1960-07-18',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR45','Marlene'),(281,2,'Chartrand','Wayne Norman','11676918','1944-06-29',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR46','Andre'),(282,2,'Ratch','Rose Maria','11214503','1964-08-30',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR47','Anne'),(283,2,'Viera Araya','Haillin','11375123','1973-06-09',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR48','Mayela'),(284,2,'Klekner','Annette','12098313','1950-06-15',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR49','Hanh'),(285,2,'Brock','Janice','11474410','1952-10-19',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR50','Elaine'),(286,2,'Van Wagner','Brenda','11625412','1949-06-16',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR51','Lee'),(287,2,'Shillington','Karen','10935730','1959-04-27',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR52','Maria'),(288,2,'Joyce','Martha','10040542','1944-06-08',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR53','Ellen'),(289,2,'Davies','Joan','11854689','1974-06-20',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR54','Marie'),(290,2,'Hunter','Daniela','10440272','1963-04-06',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR55','Elda'),(291,2,'Dove','Patricia','11354860','1971-07-16',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR56','Ann'),(292,2,'Salmon','Tammy','11665785','1972-01-14',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR57','Lynn'),(293,2,'Thomasson','Amy','11393130','1983-11-27',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR58','Nicole'),(294,2,'Hasoun jjar',' Houda','12096357','1959-01-18',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR59',NULL),(295,2,'Dawes','Elisabeth','11771768','1974-12-09',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR60','Anne'),(296,2,'Gillis','Deborah','11476099','1956-08-28',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR61','Anne'),(297,2,'Down','Patti','10443713','1961-07-20',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR62','Lou'),(298,2,'Furtado','Lizete','10404387','1955-05-30',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR63','Maria'),(299,2,'Smith','Marlyn Inrien','11476356','1957-03-18',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR64','Monica'),(300,2,'Young','Barbara','10532573','1946-05-28',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR65','Anne'),(301,2,'Waltho','Marilyn','11614109','1943-12-22',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR66','Anne'),(302,2,'Persaud','Julia','11525513','1951-04-29',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR67','Angela'),(303,2,'Holbrough','Martha','11818498','1960-10-09',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR68','Mary'),(304,2,'McNeil','Maria','12101209','1968-01-11',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR69','Rosaria'),(305,2,'Simon','Nicole ncy','11613440','1975-05-21',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR70','Marie'),(306,2,'Reed','Elaine','10524807','1953-11-23',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR71','Patricia'),(307,2,'Turlin','Tracy','12104990','1971-09-29',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR73','Lea'),(308,2,'Wilkinson',' Fiona','10502760','1955-09-21',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR72',NULL),(309,2,'Smith','Elaine','10649283','1958-10-24',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR74','Marie'),(310,2,'Harrison-O\'Conor','Caroline','11234945','1964-04-15',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR75','Augusta'),(311,2,'Persoon','Georgette','11106868','1927-05-08',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR76','Margarita'),(312,2,'Corcoran','Anne','11738187','1957-01-08',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR77','Marie'),(313,2,'James','Sylvie','11072446','1969-02-05',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR78','Monique'),(314,2,'Kersten','Barbara','11512539','1959-04-15',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR79','Frances'),(315,2,'Taylor','Jo-Anne','11437813','1975-08-17',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR80','Michelle'),(316,2,'Salts','Chantell','10166645','1985-03-10',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR81','Evelyn'),(317,2,'Simpson','Don','10590828','1956-06-14',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR82','Laurraine'),(318,2,'Shah','Bibitaben','11630466','1975-11-19',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR83','Saurabh'),(319,2,'Sadiku',' dije','10229317','1949-05-11',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR85',NULL),(320,2,'Ballantine',' Annette','11285255','1959-09-28',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR84',NULL),(321,2,'MacKinley','Katherine','11603797','1961-12-07',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR86','Marie'),(322,2,'Rocha','Maria','12103182','1946-09-29',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR87','Gloria'),(323,2,'Gehring','Melissa','10972461','1966-05-10',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR88','Christine'),(324,2,'Tobias','Robin','10645156','1967-04-15',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR89','Lynn'),(325,2,'Vasiloff','Bonnie','10695033','1963-06-20',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR90','Louise'),(326,2,'MacKenzie','Brenda','10135378',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR91','Leona'),(327,2,'Ingleton','Sheila','10609197',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR92','Margaret'),(328,2,'Pearce','Lynn','11498566',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR93','Michelle'),(329,2,'Peebles','Catherine','10183867',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR94','Elizabeth'),(330,2,'Argue',' Pierrette','12100431',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR95',NULL),(331,2,'Randall','Jacqueline','12106858',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR96','Anne'),(332,2,'Kitzan','Pamela','11187697',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR97','Lorraine'),(333,2,'Nicholson','Cynthia Lee','10172640',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR98','Elizabeth'),(334,2,'Goetz','Karen','11055152',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR99','Elsbeth'),(335,2,'Arseneau','Kimberley','12093180',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR100','Vera'),(336,2,'Baverstock','Marla','10662048',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR101','Grace'),(337,2,'Rath','Catherine','10527459',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR102','Ann'),(338,2,'Oakley','Sherri','11608779',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR103','Lynne'),(339,2,'Chmielowski','Joanna','11258825',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR104','Krystyna'),(340,2,'Girdharry','Silla','10642406',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR105','Zena'),(341,2,'Vance','Cheryl','11204339',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR106','Jean'),(342,2,'Inacio','Fatima','10060643',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR107','Maria'),(343,2,'Weerts','Annabelle Emily','10281617',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR108','Marie'),(344,2,'McTavish','Terrance','10676708',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR110','John'),(345,2,'Watt','Joan','11331060',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR111','Louise'),(346,2,'Clendinning','Patricia','10891173',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR112','Dianne'),(347,2,'Jennings','Cheryl','10940734',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR114','Lynn'),(348,2,'Alqassis','Sanaa','11751334',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR115','Hanna'),(349,2,'Hartford','Nancy','10699045',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR116','Arden'),(350,2,'Scott','Teresa','12055099',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR117','Lynn'),(351,2,'Campbell','Sandra','10587310',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR118','Jane'),(352,2,'Lee','Joan','11423855',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR119','Ding'),(353,2,'Baxter','Erin','11140783',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR120','Nicole'),(354,2,'Wei',' Qing','11976890',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR121',NULL),(355,2,'Wasylyk','Dorinda','12107936',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR122','Lee'),(356,2,'Tune','Jessa','11497805',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR123','Jayne'),(357,2,'Upfold','Jane','10688975',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR124','Anne'),(358,2,'Robertson','Cecile','12071681',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR125','Louise'),(359,2,'Wilcox','Tracy','12109132',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR126','Kim'),(360,2,'Brennan','Bonnie','10638584',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR127','Lynn'),(361,2,'Macfarlane','Eileen','11464739',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR128','Ann'),(362,2,'Harrison','Linda','12056862',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR129','Daria'),(363,2,'Heynen','Kristal','10528293',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR130','Amber-Dean'),(364,2,'Cresswell','Carolyn','11589296',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR131','Jayne'),(365,2,'Hundey','Elizabeth','10021792',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR132','Jane'),(366,2,'Faden','Lisa','11554679',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR133','Yoshiko'),(367,2,'LeClair','Linnea','11310406',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR134','Elizabeth'),(368,2,'Awad','Dina','12060846',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR135','Medhat'),(369,2,'Holmann','Christine','10692940',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR136','Ann'),(370,2,'Bugg','Marie','11083919',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR137','Lydia'),(371,2,'Longstreet','Penny','11326943',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR138','Lynne'),(372,2,'Beuermann','Barbara','12107097',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR139','Elizabeth'),(373,2,'Demelo','Anna','10354083',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR140','Rita'),(374,2,'Regehr','Linda','11063830',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR141','Joanne'),(375,2,'Stubbs','Deborah','10613641',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR142','Irene'),(376,2,'Boylan','Lisa','10181390',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR143','Michelle'),(377,2,'Aitken','Joyce','11783045',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR144','Marlene'),(378,2,'Laperriere','Louise Marie','11700641',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR145','Lucille'),(379,2,'Sandhu','Rimaljit','12108080',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR146','Kaur'),(380,2,'Garcia','Bertha','10868640',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR147','Mispireta'),(381,2,'Andrus','Melissa','12098156',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR148','Marie'),(382,2,'Leach','Judith','10042406',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR149','Diane'),(383,2,'Lunick','Heather','10046123',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR150','Jane'),(384,2,'Thornicroft','Margaret','10269550',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR151','Rose'),(385,2,'Tran','Vung','10277392',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR152','Chanh'),(386,2,'Rosehart','Margaret','10556185',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR153','Alice'),(387,2,'Sutherland','Adrianne','11601841',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR154','Mae'),(388,2,'Frise','Lucille','12107400',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR155','Rose'),(389,2,'Nijland','Petronella','11383942',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR156','Jacoba'),(390,2,'Campbell','Nancy Jean','12087712',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR157','Lynne'),(391,2,'O\'Reilly','Glenda','10147937',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR158','Diane'),(392,2,'Corner','Rita','10182790',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR159','Julia'),(393,2,'L\'Heureux','Ashley','10989839',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR160','Jane'),(394,2,'Liu','Hong','11540106',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR161','Yi'),(395,2,'Hammoud','Majida','11072696',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR162','Chamdin'),(396,2,'Marron','Normita','11124722',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR163','Punsalan'),(397,2,'Tait','Lynda','11888544',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR164','Burnell'),(398,2,'Armstrong','Julie','11648102',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR165','Maude'),(399,2,'Scholtz',' Magdalena','12097475',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR166',NULL),(400,2,'Bradacs','Abby','10372507',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR167','Leigh'),(401,2,'Sanders','Tammy','10859160',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR168','Lynn'),(402,2,'Searles','Robert','10782319',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR169','Gordon'),(403,2,'Boitson','Ethelyn','10896343',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR170','Gay'),(404,2,'Mackenzie','Sandra','11330642',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR171','Ann'),(405,2,'Lingard','Lorelei','12124706',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR172','Anne'),(406,2,'Emans','Ilene','12094661',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR173','Margaret'),(407,2,'Lawton','Therese','10084086',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR174','Catherine'),(408,2,'McQuillen','Brian','11029433',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR175','Joseph'),(409,2,'Davis','Leila','11017383',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR176','Claire'),(410,2,'Clark','Deborah','10007362',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR177','Annie'),(411,2,'Gillick','Mary','10914764',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR178','Elizabeth'),(412,2,'Bushell','Ruth','11875741',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR179','Elaine'),(413,2,'Waite','Josephine','12098271',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR180','Lucinda'),(414,2,'Lambert','Alyssa Nancy','11922036',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR181','Elaine'),(415,2,'Wild','Rhea','10817603',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR182','Janice'),(416,2,'Huntley','Cynthia','10609018',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR183','Margaret'),(417,2,'Presa','Ana','11122472',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR184','Lusia'),(418,2,'Zehr','Sharon','10867149',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR185','Lynn'),(419,2,'Panniers','Lydia','11459671',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR186','Roberta'),(420,2,'Pulham','Sandra','11749606',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR187','Lynn'),(421,2,'Marriage','Beverly','12120049',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR188','Gayle'),(422,2,'Mikolaitis','Judith','11906063',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR190','Anne'),(423,2,'Thwaites','Corrina','10909819',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR191','Leah'),(424,2,'Randhawa',' Sareen','12134319',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR192',NULL),(425,2,'McGuire','Tova','10010898',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR193','May'),(426,2,'Gray','Michelle','10138681',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR194','Lynne'),(427,2,'Counter','Anne','10165741',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR195','Elizabeth'),(428,2,'Vincent',' Gracy','12132681',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR197',NULL),(429,2,'Vanveen','Marian','11628973',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR198','Elizabeth'),(430,2,'Ivankovic','Zagorka','10956609',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR199','Zaga'),(431,2,'Morfee',' Patricia','11270337',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR200',NULL),(432,2,'Van Wulven','Nikole','10143950',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR201','Corinna'),(433,2,'Rich','Catherine','10195612',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR202','Lynn'),(434,2,'Thornton','Carrie','10919481',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR204','Lynn'),(435,2,'Medynsky','Maria','10786651',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR205','Anna'),(436,2,'Heron','Elizabeth','11090061',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR206','Joan'),(437,2,'Waissi',' Snezhana','11544976',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR207',NULL),(438,2,'Cooper','Carla','10365205',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR208','Marie'),(439,2,'Greenbeck','Susan','10576520',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR209','Patricia'),(440,2,'Keenan','Sharon','10784187',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR210','Louise'),(441,2,'Plante','Nicole','11226233',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR211','Marie-Paule'),(442,2,'Delisle','Shirley','12140592',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR212','Irene'),(443,2,'Freeman','Marilyn','12113048',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR213','Patricia'),(444,2,'Duckworth','Amy','10708463',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR214','Diane'),(445,2,'Dunn','Patricia','11784107',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR215','Anne'),(446,2,'Nelson','Sara','10477605',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR216','Lynn'),(447,2,'Morris','Amelia','10136701',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR217','Bianca'),(448,2,'Gryp','Bonnie','10969025',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR218','Elaine'),(449,2,'Rempel','Dennese','11945915',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR219','Margarethe'),(450,2,'Mucha',' Izabela','10132808',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR220',NULL),(451,2,'Ali','Zemrid','11192432',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR223','Jamil'),(452,2,'Beattie','Vanessa','10816021',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR224','Faye'),(453,2,'Lefteris','Jennifer','11079701',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR225','Ann'),(454,2,'Baldinelli','Paula','10736128',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR226','Isabel'),(455,2,'Beavis','Alysse','11552463',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR227','Marie'),(456,2,'Fairfield','Rowena','12155612',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR228','Jane'),(457,2,'Dickson','Lynda','10750065',NULL,NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-20 16:40:55','2019-11-20 16:40:55',NULL,'BR229','Sue'),(458,2,'Heath','Julie','121252','1960-01-01',NULL,NULL,'Antiperovitch, Pavel','Antiperovitch, Pavel','2019-11-22 18:36:39','2019-11-22 18:36:39','M','',''),(462,2,'Testr','John','121212','1960-10-01',NULL,NULL,NULL,'Antiperovitch, Pavel','2019-11-22 18:50:07','2019-11-22 18:50:07','M','',''),(463,3,'asdf','asdf','23235235','2018-01-01',NULL,NULL,NULL,'Antiperovitch, Pavel','2020-12-31 18:04:59','2020-12-31 18:04:59','M','','');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registries`
--

DROP TABLE IF EXISTS `registries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `registries` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `registryName` varchar(255) DEFAULT NULL,
  `prefix` varchar(255) DEFAULT NULL,
  `shortName` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `imageURI` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `details` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `registries_registryname_unique` (`registryName`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registries`
--

LOCK TABLES `registries` WRITE;
/*!40000 ALTER TABLE `registries` DISABLE KEYS */;
INSERT INTO `registries` VALUES (1,'Sarcoidosis','sa','sarcoidosis','green',NULL,1,NULL),(2,'Medical Oncology','onc','medical_oncology','red',NULL,1,NULL),(3,'Heart Failure','hf','heart_failure','blue',NULL,1,NULL);
/*!40000 ALTER TABLE `registries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatments`
--

DROP TABLE IF EXISTS `treatments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `treatments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `patientId` int(10) unsigned DEFAULT NULL,
  `treatmentDate` date DEFAULT NULL,
  `treatmentEndDate` date DEFAULT NULL,
  `treatmentName` varchar(255) DEFAULT NULL,
  `dose` int(11) DEFAULT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `comments` text,
  `details` json DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `treatments_patientid_index` (`patientId`),
  CONSTRAINT `treatments_patientid_foreign` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatments`
--

LOCK TABLES `treatments` WRITE;
/*!40000 ALTER TABLE `treatments` DISABLE KEYS */;
/*!40000 ALTER TABLE `treatments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usergrouplink`
--

DROP TABLE IF EXISTS `usergrouplink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usergrouplink` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned DEFAULT NULL,
  `usergroupId` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usergrouplink_userid_foreign` (`userId`),
  KEY `usergrouplink_usergroupid_foreign` (`usergroupId`),
  CONSTRAINT `usergrouplink_usergroupid_foreign` FOREIGN KEY (`usergroupId`) REFERENCES `usergroups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `usergrouplink_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usergrouplink`
--

LOCK TABLES `usergrouplink` WRITE;
/*!40000 ALTER TABLE `usergrouplink` DISABLE KEYS */;
INSERT INTO `usergrouplink` VALUES (1,1,1),(4,6,2),(5,6,1),(7,1,4),(9,3,1),(10,3,3),(11,12,3),(12,12,4),(13,1,3),(14,1,5);
/*!40000 ALTER TABLE `usergrouplink` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usergroups`
--

DROP TABLE IF EXISTS `usergroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usergroups` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `groupName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usergroups_groupname_unique` (`groupName`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usergroups`
--

LOCK TABLES `usergroups` WRITE;
/*!40000 ALTER TABLE `usergroups` DISABLE KEYS */;
INSERT INTO `usergroups` VALUES (1,'Admin'),(5,'Heart Failure'),(4,'Medical Oncology'),(3,'Sarcoidosis'),(2,'User');
/*!40000 ALTER TABLE `usergroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `loginCount` int(11) DEFAULT '0',
  `loginAttempts` int(11) DEFAULT '0',
  `lastLogin` datetime DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Pavel','Antiperovitch','apavel@gmail.com','$2a$08$vdwyM2dZc8kdPA99Qk09de8lDn1Hw65sWC7RmA8X3ZRALQ6S1cAy2',522,0,'2020-12-31 15:28:01',1,'2019-07-17 21:43:26','apavel'),(3,'Minime','James','apavelr@gmail.com','$2a$08$ENmdHOe/6hWlEQpKLgMiNeLc2erYzy8zKoCu0T9J0Z7SE07vkHkNm',0,0,NULL,1,'2019-07-17 21:43:26','apavel1'),(6,'ASDFASDF','asdfasdf','asdf@asdf.net','$2a$08$PPkJiJsZkSQtgpv1POH6/eaRViOqXwVSowIh5A1FXAHSIQZtTUcje',0,0,NULL,1,'2019-07-26 18:48:38',NULL),(8,'asdfasdf','asdfasdg','asdf@asdfasd.net','$2a$08$t.oHR3pVElxbWt4GAeBK6uQvS5RozZeIfUBPvEkxgtozYmGUaR9kq',0,0,NULL,0,'2019-07-26 18:54:41','user4'),(12,'asdf','asdf','asdf1@asdf1.net','$2a$08$XRuI44SnJzt1O7B8riXMyevY5QexVz9RApILAQaivRywRT3MRNPii',1,0,'2019-08-23 13:45:35',1,'2019-08-23 17:44:59','apavel4');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-01 13:15:40
