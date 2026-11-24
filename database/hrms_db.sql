-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: hrms_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendance_records`
--

DROP TABLE IF EXISTS `attendance_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attendance_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization_id` varchar(50) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `employee_name` varchar(200) NOT NULL,
  `employee_avatar` text DEFAULT NULL,
  `department` varchar(150) NOT NULL,
  `date` date NOT NULL,
  `check_in` varchar(20) DEFAULT NULL,
  `check_out` varchar(20) DEFAULT NULL,
  `work_hours` varchar(50) DEFAULT 'In Progress',
  `status` enum('present','late','absent','on_leave','half_day') DEFAULT 'present',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `date` (`date`),
  KEY `organization_id` (`organization_id`),
  CONSTRAINT `attendance_records_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_records`
--

LOCK TABLES `attendance_records` WRITE;
/*!40000 ALTER TABLE `attendance_records` DISABLE KEYS */;
INSERT INTO `attendance_records` VALUES (1,'org-osforh','emp-osf-001','Tariq Mansour','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80','Software Engineering','2026-11-20','08:55 AM','05:45 PM','8h 50m','present',NULL,'2026-11-20 04:44:22'),(2,'org-osforh','emp-osf-002','Sarah Al-Hashemi','https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80','Human Resources & Talent','2026-11-20','09:02 AM',NULL,'In Progress','present',NULL,'2026-11-20 04:44:22'),(3,'org-osforh','emp-osf-003','Zayd Kareem','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80','Product & Design','2026-11-20','09:42 AM',NULL,'In Progress','late',NULL,'2026-11-20 04:44:22'),(4,'org-osforh','emp-osf-004','Amira Nasser','https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80','Software Engineering','2026-11-20',NULL,NULL,'0h','on_leave',NULL,'2026-11-20 04:44:22'),(5,'org-osforh','emp-osf-006','Elena Rostova','https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80','Product & Design','2026-11-20','08:48 AM',NULL,'In Progress','present',NULL,'2026-11-20 04:44:22');
/*!40000 ALTER TABLE `attendance_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `celebration_events`
--

DROP TABLE IF EXISTS `celebration_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `celebration_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization_id` varchar(50) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `employee_name` varchar(200) NOT NULL,
  `employee_avatar` text DEFAULT NULL,
  `department` varchar(150) NOT NULL,
  `type` enum('birthday','anniversary') NOT NULL,
  `event_date` varchar(10) NOT NULL,
  `display_date` varchar(20) NOT NULL,
  `years_milestone` int(11) DEFAULT NULL,
  `wishes_sent` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  CONSTRAINT `celebration_events_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `celebration_events`
--

LOCK TABLES `celebration_events` WRITE;
/*!40000 ALTER TABLE `celebration_events` DISABLE KEYS */;
INSERT INTO `celebration_events` VALUES (1,'org-osforh','emp-osf-006','Elena Rostova','https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80','Product & Design','birthday','11-21','Nov 21',NULL,0),(2,'org-osforh','emp-osf-004','Amira Nasser','https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80','Software Engineering','birthday','11-23','Nov 23',NULL,0),(3,'org-osforh','emp-osf-001','Tariq Mansour','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80','Software Engineering','anniversary','11-25','Nov 25',3,0);
/*!40000 ALTER TABLE `celebration_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departments` (
  `id` varchar(50) NOT NULL,
  `organization_id` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `code` varchar(20) NOT NULL,
  `budget` decimal(12,2) DEFAULT 0.00,
  `employee_count` int(11) DEFAULT 0,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES ('dept-osf-eng','org-osforh','Software Engineering','ENG',450000.00,58,'Product engineering & full stack teams'),('dept-osf-fin','org-osforh','Finance & Compliance','FIN',120000.00,16,'Financial controllership & audit'),('dept-osf-hr','org-osforh','Human Resources & Talent','HRT',150000.00,14,'People operations, recruiting and culture'),('dept-osf-prod','org-osforh','Product & Design','PRD',220000.00,24,'UI/UX and product discovery squads'),('dept-osf-sales','org-osforh','Enterprise Sales & Growth','SLS',310000.00,30,'Enterprise accounts & customer success');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employees` (
  `id` varchar(50) NOT NULL,
  `organization_id` varchar(50) NOT NULL,
  `employee_code` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `full_name` varchar(200) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `emergency_contact_name` varchar(150) DEFAULT NULL,
  `emergency_contact_phone` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `avatar` text DEFAULT NULL,
  `department_id` varchar(50) NOT NULL,
  `department_name` varchar(150) NOT NULL,
  `designation` varchar(150) NOT NULL,
  `joining_date` date NOT NULL,
  `birth_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `employment_type` varchar(50) DEFAULT 'full_time',
  `status` varchar(50) DEFAULT 'active',
  `basic_salary` decimal(10,2) DEFAULT 0.00,
  `allowances` decimal(10,2) DEFAULT 0.00,
  `gross_salary` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `organization_id` (`organization_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES ('emp-osf-001','org-osforh','OSF-1001','Tariq','Mansour','Tariq Mansour','tariq.mansour@osforh.com','+971 50 123 4567','Layla Mansour (Spouse)','+971 50 999 8888','Villa 42, Al Barsha 2, Dubai, UAE','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80','dept-osf-eng','Software Engineering','VP of Engineering','2021-03-15','1985-11-25',NULL,'full_time','active',12000.00,4500.00,16500.00,'2026-11-20 04:44:22'),('emp-osf-002','org-osforh','OSF-1002','Sarah','Al-Hashemi','Sarah Al-Hashemi','sarah.hashemi@osforh.com','+971 55 987 6543','Omar Al-Hashemi (Brother)','+971 55 111 2233','Apt 1402, Marina Gate 1, Dubai Marina, UAE','https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80','dept-osf-hr','Human Resources & Talent','Head of People Operations','2022-01-10','1989-11-20',NULL,'full_time','active',9500.00,3500.00,13000.00,'2026-11-20 04:44:22'),('emp-osf-003','org-osforh','OSF-1003','Zayd','Kareem','Zayd Kareem','zayd.kareem@osforh.com','+971 52 444 7788','Nadia Kareem (Spouse)','+971 52 333 4455','Downtown Views II, Downtown Dubai, UAE','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80','dept-osf-prod','Product & Design','Principal Product Manager','2022-06-01','1992-04-14',NULL,'full_time','active',8000.00,3000.00,11000.00,'2026-11-20 04:44:22'),('emp-osf-004','org-osforh','OSF-1004','Amira','Nasser','Amira Nasser','amira.nasser@osforh.com','+20 100 234 5678','Hossam Nasser (Father)','+20 100 999 0000','Tower 3, Business Bay, Dubai, UAE','https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80','dept-osf-eng','Software Engineering','Senior Full Stack Lead','2023-02-15','1994-11-23',NULL,'full_time','active',6500.00,2000.00,8500.00,'2026-11-20 04:44:22'),('emp-osf-005','org-osforh','OSF-1005','Karim','Fawzy','Karim Fawzy','karim.fawzy@osforh.com','+971 50 888 3344',NULL,NULL,NULL,'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80','dept-osf-fin','Finance & Compliance','Senior Financial Controller','2021-11-01','1987-08-19',NULL,'full_time','active',7200.00,2800.00,10000.00,'2026-11-20 04:44:22'),('emp-osf-006','org-osforh','OSF-1006','Elena','Rostova','Elena Rostova','elena.rostova@osforh.com','+971 54 222 9988','Dmitry Rostov (Brother)','+971 54 888 7766','JBR Sadaf 4, Dubai, UAE','https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80','dept-osf-prod','Product & Design','Senior UI/UX Designer','2023-07-01','1995-11-21',NULL,'full_time','active',5500.00,2000.00,7500.00,'2026-11-20 04:44:22');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_requests`
--

DROP TABLE IF EXISTS `leave_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leave_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organization_id` varchar(50) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `employee_name` varchar(200) NOT NULL,
  `employee_avatar` text DEFAULT NULL,
  `department` varchar(150) NOT NULL,
  `leave_type` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_days` int(11) NOT NULL,
  `reason` text NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_requests`
--

LOCK TABLES `leave_requests` WRITE;
/*!40000 ALTER TABLE `leave_requests` DISABLE KEYS */;
INSERT INTO `leave_requests` VALUES (1,'org-osforh','emp-osf-004','Amira Nasser','https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80','Software Engineering','annual','2026-12-01','2026-12-03',3,'Family trip & vacation','pending','2026-11-20 04:44:22'),(2,'org-osforh','emp-osf-003','Zayd Kareem','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80','Product & Design','casual','2026-11-26','2026-11-26',1,'Personal emergency','approved','2026-11-20 04:44:22');
/*!40000 ALTER TABLE `leave_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizations`
--

DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organizations` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(20) NOT NULL,
  `industry` varchar(100) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'USD',
  `currency_symbol` varchar(5) DEFAULT '$',
  `timezone` varchar(50) DEFAULT 'UTC',
  `contact_email` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `tax_id` varchar(100) DEFAULT NULL,
  `daily_work_hours` decimal(4,2) DEFAULT 8.00,
  `default_probation_months` int(11) DEFAULT 3,
  `enable_geofencing` tinyint(1) DEFAULT 1,
  `enable_overtime` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
INSERT INTO `organizations` VALUES ('org-osforh','OSFORH Software Solutions','OSF','Enterprise Software & IT Solutions','USD','$','Asia/Dubai (UTC+4)','contact@osforh.com','+971 4 398 2100','https://osforh.com','AE-TRN-100482910300003',8.00,3,1,1,'2026-11-20 04:44:22');
/*!40000 ALTER TABLE `organizations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-20 12:17:34
