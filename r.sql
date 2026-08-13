-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: learnhub
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `announcement`
--

DROP TABLE IF EXISTS `announcement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `courseId` int NOT NULL,
  `teacherId` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_14ab21f48788df5d132a7c6be8d` (`courseId`),
  KEY `FK_778c76268d7fd9dd9a3497c82b8` (`teacherId`),
  CONSTRAINT `FK_14ab21f48788df5d132a7c6be8d` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_778c76268d7fd9dd9a3497c82b8` FOREIGN KEY (`teacherId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement`
--

LOCK TABLES `announcement` WRITE;
/*!40000 ALTER TABLE `announcement` DISABLE KEYS */;
INSERT INTO `announcement` VALUES (1,'HELLO ALL .....','Exam comming soon.....',1,3,'2026-08-06 17:28:24.063184');
/*!40000 ALTER TABLE `announcement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `attemptId` int NOT NULL,
  `questionId` int NOT NULL,
  `selectedOptionId` int DEFAULT NULL,
  `isCorrect` tinyint NOT NULL DEFAULT '0',
  `marksObtained` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_df3b92aa295640d070922ebc382` (`attemptId`),
  KEY `FK_a4013f10cd6924793fbd5f0d637` (`questionId`),
  KEY `FK_2b7f7332c9ea46974c6ee95c93f` (`selectedOptionId`),
  CONSTRAINT `FK_2b7f7332c9ea46974c6ee95c93f` FOREIGN KEY (`selectedOptionId`) REFERENCES `option` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_a4013f10cd6924793fbd5f0d637` FOREIGN KEY (`questionId`) REFERENCES `question` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_df3b92aa295640d070922ebc382` FOREIGN KEY (`attemptId`) REFERENCES `exam_attempt` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer`
--

LOCK TABLES `answer` WRITE;
/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
INSERT INTO `answer` VALUES (39,9,16,61,0,0),(40,9,17,66,0,0),(41,9,18,69,0,0),(42,9,19,74,0,0),(43,9,20,78,1,1);
/*!40000 ALTER TABLE `answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificate`
--

DROP TABLE IF EXISTS `certificate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificate` (
  `id` int NOT NULL AUTO_INCREMENT,
  `certificateNumber` varchar(255) NOT NULL,
  `studentId` int NOT NULL,
  `examId` int NOT NULL,
  `attemptId` int NOT NULL,
  `courseId` int NOT NULL,
  `score` float NOT NULL,
  `percentage` float NOT NULL,
  `issuedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_40d84ebdb0947b84825412858f` (`certificateNumber`),
  UNIQUE KEY `IDX_e056b4cad2207294a8ccabac8d` (`studentId`,`courseId`),
  KEY `FK_bac32bce7128f842d9f8c401309` (`examId`),
  KEY `FK_77221172bacf4080af83b5d9154` (`attemptId`),
  KEY `FK_067bc1af8daea88b10772b8749f` (`courseId`),
  CONSTRAINT `FK_067bc1af8daea88b10772b8749f` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_77221172bacf4080af83b5d9154` FOREIGN KEY (`attemptId`) REFERENCES `exam_attempt` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_a5b1acee8501273d8c777df4bc1` FOREIGN KEY (`studentId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_bac32bce7128f842d9f8c401309` FOREIGN KEY (`examId`) REFERENCES `exam` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificate`
--

LOCK TABLES `certificate` WRITE;
/*!40000 ALTER TABLE `certificate` DISABLE KEYS */;
INSERT INTO `certificate` VALUES (11,'LH-CERT-1786446473069-9',2,4,9,4,1,20,'2026-08-11 16:37:53.074110');
/*!40000 ALTER TABLE `certificate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `category` varchar(255) NOT NULL,
  `teacherId` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_3e002f760e8099dd5796e5dc93b` (`teacherId`),
  CONSTRAINT `FK_3e002f760e8099dd5796e5dc93b` FOREIGN KEY (`teacherId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'java Dsa','learn this course and bulid logic ','https://images.unsplash.com/photo-1516321318423-f06f85e504b3',499.00,'Data Structure',3,'2026-08-06 17:12:19.625940','2026-08-06 17:12:19.625940'),(2,'JavaScript','javascript , learn & grow','https://i.ytimg.com/vi/hdI2bqOjy3c/maxresdefault.jpg',99.00,'javascript ',3,'2026-08-07 15:28:19.608438','2026-08-07 15:28:19.608438'),(4,'ReactJs','eifjowkql[fqwfqwfqwfwqf','https://images.unsplash.com/photo-1498050108023-c5249f4df085',491.00,'frontend ',3,'2026-08-08 11:07:15.335134','2026-08-08 11:07:15.335134');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollment`
--

DROP TABLE IF EXISTS `enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enrolledAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `progress` int NOT NULL DEFAULT '0',
  `completed` tinyint NOT NULL DEFAULT '0',
  `userId` int DEFAULT NULL,
  `courseId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_bb8d5ae5e144676c88c0ebd3c1` (`userId`,`courseId`),
  KEY `FK_d1a599a7740b4f4bd1120850f04` (`courseId`),
  CONSTRAINT `FK_d1a599a7740b4f4bd1120850f04` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_e97ecbf11356b5173ce7fb0b060` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollment`
--

LOCK TABLES `enrollment` WRITE;
/*!40000 ALTER TABLE `enrollment` DISABLE KEYS */;
INSERT INTO `enrollment` VALUES (1,'2026-08-06 17:45:22',100,1,2,1),(2,'2026-08-07 15:28:47',0,0,2,2),(5,'2026-08-11 16:34:04',100,1,2,4);
/*!40000 ALTER TABLE `enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam`
--

DROP TABLE IF EXISTS `exam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `duration` int NOT NULL DEFAULT '30',
  `totalMarks` int NOT NULL DEFAULT '0',
  `passingPercentage` int NOT NULL DEFAULT '40',
  `isPublished` tinyint NOT NULL DEFAULT '0',
  `teacherId` int NOT NULL,
  `courseId` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_d8925a9c61fc74fdacfc5f0b2db` (`teacherId`),
  KEY `FK_e6b0d68b26f7847f2d46810df8f` (`courseId`),
  CONSTRAINT `FK_d8925a9c61fc74fdacfc5f0b2db` FOREIGN KEY (`teacherId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_e6b0d68b26f7847f2d46810df8f` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam`
--

LOCK TABLES `exam` WRITE;
/*!40000 ALTER TABLE `exam` DISABLE KEYS */;
INSERT INTO `exam` VALUES (4,'react - AI Quiz','AI generated quiz on react',30,5,4,1,3,4,'2026-08-11 16:32:39.344478','2026-08-11 16:33:32.000000'),(5,'conponent - AI Quiz','AI generated quiz on conponent',30,5,4,1,3,4,'2026-08-13 14:30:31.471750','2026-08-13 14:32:07.000000');
/*!40000 ALTER TABLE `exam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_attempt`
--

DROP TABLE IF EXISTS `exam_attempt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_attempt` (
  `id` int NOT NULL AUTO_INCREMENT,
  `score` int NOT NULL DEFAULT '0',
  `percentage` int NOT NULL DEFAULT '0',
  `passed` tinyint NOT NULL DEFAULT '0',
  `submitted` tinyint NOT NULL DEFAULT '0',
  `studentId` int NOT NULL,
  `examId` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_0ac85d06946f4e82fbe0b184cad` (`studentId`),
  KEY `FK_37a9843a232fe8ebfa58fb4412c` (`examId`),
  CONSTRAINT `FK_0ac85d06946f4e82fbe0b184cad` FOREIGN KEY (`studentId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_37a9843a232fe8ebfa58fb4412c` FOREIGN KEY (`examId`) REFERENCES `exam` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_attempt`
--

LOCK TABLES `exam_attempt` WRITE;
/*!40000 ALTER TABLE `exam_attempt` DISABLE KEYS */;
INSERT INTO `exam_attempt` VALUES (9,1,20,1,1,2,4,'2026-08-11 16:37:07.762949');
/*!40000 ALTER TABLE `exam_attempt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `live_classes`
--

DROP TABLE IF EXISTS `live_classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `live_classes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `courseId` int NOT NULL,
  `teacherId` int NOT NULL,
  `scheduledAt` datetime NOT NULL,
  `startedAt` datetime DEFAULT NULL,
  `endedAt` datetime DEFAULT NULL,
  `isLive` tinyint NOT NULL DEFAULT '0',
  `isCompleted` tinyint NOT NULL DEFAULT '0',
  `isCancelled` tinyint NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `live_classes`
--

LOCK TABLES `live_classes` WRITE;
/*!40000 ALTER TABLE `live_classes` DISABLE KEYS */;
INSERT INTO `live_classes` VALUES (1,'javascript crass course','pokdoq',2,3,'2026-08-10 03:00:00','2026-08-10 15:07:46','2026-08-10 15:14:03',0,1,0,'2026-08-10 15:07:21.831266','2026-08-10 15:14:02.000000'),(2,'java dsa','iwjdowdowd',1,3,'2026-08-03 15:28:00','2026-08-10 15:29:07','2026-08-10 15:31:20',0,1,0,'2026-08-10 15:28:53.717128','2026-08-10 15:31:20.000000'),(3,'second live class','doqjdoqd',1,3,'2026-08-10 15:45:00','2026-08-10 15:45:57','2026-08-10 16:19:06',0,1,0,'2026-08-10 15:45:53.077370','2026-08-10 16:19:05.000000'),(4,'java dsa','djpdjqdqdq',1,3,'2026-08-10 16:32:00','2026-08-10 16:32:44','2026-08-10 16:37:29',0,1,0,'2026-08-10 16:32:39.096978','2026-08-10 16:37:29.000000'),(5,'live learn','widjpqwjd',1,3,'2026-08-10 16:43:00','2026-08-10 16:44:03','2026-08-10 16:50:19',0,1,0,'2026-08-10 16:44:00.104178','2026-08-10 16:50:18.000000'),(6,'java dsa','idjsjdldpqwk[dqw[d dbqwpod',1,3,'2026-08-10 18:21:00','2026-08-10 18:21:38','2026-08-11 10:17:29',0,1,0,'2026-08-10 18:21:31.491492','2026-08-11 10:17:29.000000'),(7,'dijid','djjoqdjoq',4,3,'2026-08-11 10:58:00','2026-08-11 10:59:08','2026-08-11 11:51:39',0,1,0,'2026-08-11 10:59:01.667340','2026-08-11 11:51:38.000000'),(8,'live now','diwd',1,3,'2026-08-12 10:33:00','2026-08-12 11:17:11','2026-08-12 11:49:05',0,1,0,'2026-08-12 10:33:27.477514','2026-08-12 11:49:05.000000'),(9,'java dsa','jwwjow',1,3,'2026-08-12 10:34:00','2026-08-12 11:56:52','2026-08-12 12:01:40',0,1,0,'2026-08-12 10:34:04.891910','2026-08-12 12:01:40.000000'),(10,'java dsa','w9fuqw9fuqw',1,3,'2026-08-12 10:39:00','2026-08-12 12:27:52','2026-08-12 12:33:47',0,1,0,'2026-08-12 10:39:20.621555','2026-08-12 12:33:46.000000'),(11,'java mock test','odjwqpodj[qw',1,3,'2026-08-12 10:46:00','2026-08-12 14:17:08','2026-08-12 14:50:21',0,1,0,'2026-08-12 10:46:14.489480','2026-08-12 14:50:20.000000'),(12,'jdjqd','qdoqjodq',1,3,'2026-08-12 10:50:00','2026-08-12 14:56:52','2026-08-12 14:58:29',0,1,0,'2026-08-12 10:50:51.671423','2026-08-12 14:58:28.000000'),(13,'javascript','wjdowd',2,3,'2026-08-12 10:51:00','2026-08-12 15:03:39','2026-08-12 15:25:52',0,1,0,'2026-08-12 10:51:20.485729','2026-08-12 15:25:52.000000'),(14,'odjqod','dqjoq',4,3,'2026-08-12 10:52:00','2026-08-12 15:48:20','2026-08-12 15:52:55',0,1,0,'2026-08-12 10:52:55.872697','2026-08-12 15:52:55.000000'),(15,'odqpod','dijq',4,3,'2026-08-12 11:00:00','2026-08-12 17:52:16','2026-08-12 18:34:00',0,1,0,'2026-08-12 11:00:34.545023','2026-08-12 18:34:00.000000'),(16,'hdiw','qdoqjdjq',4,3,'2026-08-12 17:08:00','2026-08-12 17:05:43','2026-08-12 17:06:51',0,1,0,'2026-08-12 17:04:15.910556','2026-08-12 17:06:51.000000');
/*!40000 ALTER TABLE `live_classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `note`
--

DROP TABLE IF EXISTS `note`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `note` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `noteUrl` text NOT NULL,
  `publicId` varchar(255) NOT NULL,
  `courseId` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `note`
--

LOCK TABLES `note` WRITE;
/*!40000 ALTER TABLE `note` DISABLE KEYS */;
INSERT INTO `note` VALUES (1,'Demo of certificate','Demo of certificate','https://res.cloudinary.com/n2trwj6s/raw/upload/v1786017446/learnhub/notes/file_bnvjzq','learnhub/notes/file_bnvjzq',1,'2026-08-06 17:27:26.137139','2026-08-06 17:27:26.137139');
/*!40000 ALTER TABLE `note` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('ENROLLMENT','COURSE','VIDEO','NOTES','ASSIGNMENT','EXAM','CERTIFICATE','ANNOUNCEMENT','COURSE_APPROVED','COURSE_REJECTED','SYSTEM') NOT NULL DEFAULT 'SYSTEM',
  `isRead` tinyint NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_1ced25315eb974b73391fb1c81b` (`userId`),
  CONSTRAINT `FK_1ced25315eb974b73391fb1c81b` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (3,'New Student Enrolled','Ram enrolled in your course \"JavaScript\".','ENROLLMENT',1,'2026-08-07 17:35:25.418037',3),(4,'New Course Available ?','ReactJs has been added. Start learning now!','COURSE',1,'2026-08-08 11:07:15.357433',2),(6,'New Exam Available ?','java - AI Quiz has been published for your course.','EXAM',1,'2026-08-11 15:23:25.957744',2),(7,'New Exam Available ?','java dsa basic - AI Quiz has been published for your course.','EXAM',1,'2026-08-11 16:17:37.437491',2),(8,'Course Enrolled','You have successfully enrolled in \"ReactJs\".','ENROLLMENT',1,'2026-08-11 16:34:04.407800',2),(9,'New Student Enrolled','sumit enrolled in your course \"ReactJs\".','ENROLLMENT',1,'2026-08-11 16:34:04.420487',3),(10,'New Video Available ?','djoqwjd has been added to your course.','VIDEO',1,'2026-08-11 16:36:15.198455',2),(11,'New Exam Available ?','conponent - AI Quiz has been published for your course.','EXAM',0,'2026-08-13 14:32:07.085738',2);
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `option`
--

DROP TABLE IF EXISTS `option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `option` (
  `id` int NOT NULL AUTO_INCREMENT,
  `optionText` varchar(255) NOT NULL,
  `isCorrect` tinyint NOT NULL DEFAULT '0',
  `questionId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_b94517ccffa9c97ebb8eddfcae3` (`questionId`),
  CONSTRAINT `FK_b94517ccffa9c97ebb8eddfcae3` FOREIGN KEY (`questionId`) REFERENCES `question` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `option`
--

LOCK TABLES `option` WRITE;
/*!40000 ALTER TABLE `option` DISABLE KEYS */;
INSERT INTO `option` VALUES (61,'useEffect',0,16),(62,'useMemo',1,16),(63,'useCallback',0,16),(64,'useReducer',0,16),(65,'To securely encrypt item data in the DOM',0,17),(66,'To style list items dynamically',0,17),(67,'To help React identify which items have changed, been added, or been removed',1,17),(68,'To set the index of items for CSS grid positioning',0,17),(69,'Only once when the component mounts',0,18),(70,'Only when the component unmounts',0,18),(71,'After every single render of the component',1,18),(72,'Only when state variables change',0,18),(73,'Moving state from a child component to its closest common ancestor so it can be shared',1,19),(74,'Migrating local component state to a global Redux store',0,19),(75,'Persisting state in local storage before component unmount',0,19),(76,'Optimizing state updates using asynchronous batching',0,19),(77,'It bypasses the browser\'s native event handling completely to prevent any default behaviors.',0,20),(78,'It is a cross-browser wrapper around the browser\'s native event, ensuring consistent properties across different browsers.',1,20),(79,'It only works with class components and is deprecated in modern functional components.',0,20),(80,'It prevents developers from accessing the underlying native browser event.',0,20),(81,'It inevitably leads to memory leaks due to retained garbage collection roots in the virtual DOM.',0,21),(82,'Any update to the context value triggers a re-render of all consumer components, bypassing normal memoization unless carefully mitigated with selectors.',1,21),(83,'It restricts the component from utilizing asynchronous server-side rendering pipelines.',0,21),(84,'It automatically violates the single responsibility principle at the component tree root.',0,21),(85,'The HTMLImports polyfill layer',0,22),(86,'The closed or open shadow root boundary',1,22),(87,'The custom elements registry lock',0,22),(88,'The CSS StyleSheet virtual constructor',0,22),(89,'HOCs wrap the component statically at definition time, whereas render props handle dynamic composition via function children at render time.',1,23),(90,'HOCs execute asynchronously, while render props are strictly synchronous.',0,23),(91,'Render props cannot manage local component state, whereas HOCs inherently encapsulate state.',0,23),(92,'HOCs operate exclusively on native DOM nodes, whereas render props operate on virtual nodes.',0,23),(93,'It terminates the network request of the suspended component to prevent thread starvation.',0,24),(94,'It catches the thrown promise, aborts the current tree render, and immediately forces a synchronous fallback flush.',0,24),(95,'It catches the thrown promise from the asynchronous operation and renders a fallback UI while continuing to render other branches of the tree concurrently.',1,24),(96,'It isolates the component\'s state mutations to prevent race conditions during concurrent data fetching.',0,24),(97,'The Headless Component pattern, separating behavior and logic from visual presentation via exposed hooks or props.',1,25),(98,'The Monolithic Service Component pattern, embedding HTTP clients directly inside the render cycle.',0,25),(99,'The Singleton Component pattern, forcing a single global instance across the application lifecycle.',0,25),(100,'The Mixin Pattern, injecting data properties directly into the component prototype.',0,25);
/*!40000 ALTER TABLE `option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `id` int NOT NULL AUTO_INCREMENT,
  `questionText` text NOT NULL,
  `marks` int NOT NULL DEFAULT '1',
  `questionType` varchar(255) NOT NULL DEFAULT 'single',
  `examId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_286bbf761d3af4e2fcac4a634d5` (`examId`),
  CONSTRAINT `FK_286bbf761d3af4e2fcac4a634d5` FOREIGN KEY (`examId`) REFERENCES `exam` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (16,'Which hook should be used to avoid expensive recalculations on every render in a functional component?',1,'single',4),(17,'What is the primary purpose of the key prop when rendering lists of elements in React?',1,'single',4),(18,'When using the useEffect hook without a dependency array, when does the effect function execute?',1,'single',4),(19,'What does Lifting State Up refer to in React architecture?',1,'single',4),(20,'Which of the following is true regarding React\'s SyntheticEvent system?',1,'single',4),(21,'In advanced frontend component architecture, what is the primary architectural hazard of relying heavily on deeply nested component context providers for state management?',1,'single',5),(22,'When implementing a Web Component via the Shadow DOM, which encapsulation boundary prevents external global CSS stylesheets from bleeding into the component?',1,'single',5),(23,'What distinguishes a higher-order component (HOC) from a render props pattern in modern component design paradigms regarding execution and composition?',1,'single',5),(24,'In concurrent UI rendering environments, what is the specific role of component suspense boundaries when an asynchronous child component suspends execution?',1,'single',5),(25,'Which design pattern is most effective for ensuring that a reusable UI component remains agnostic to underlying data-fetching strategies while maintaining strict type safety?',1,'single',5);
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rating`
--

DROP TABLE IF EXISTS `rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rating` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rating` int NOT NULL,
  `review` text,
  `studentId` int NOT NULL,
  `courseId` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_b110361349c7bcee2966f39ef5a` (`studentId`),
  KEY `FK_1283cbb80fa7bddb804f81fa10d` (`courseId`),
  CONSTRAINT `FK_1283cbb80fa7bddb804f81fa10d` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_b110361349c7bcee2966f39ef5a` FOREIGN KEY (`studentId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rating`
--

LOCK TABLES `rating` WRITE;
/*!40000 ALTER TABLE `rating` DISABLE KEYS */;
INSERT INTO `rating` VALUES (1,5,'great experience with u ...',2,1,'2026-08-06 18:27:13.320172','2026-08-07 11:28:21.000000'),(2,5,'',2,2,'2026-08-11 11:52:55.890303','2026-08-11 11:52:55.890303');
/*!40000 ALTER TABLE `rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'student',
  `refreshToken` varchar(500) DEFAULT NULL,
  `profileImageUrl` varchar(1000) DEFAULT NULL,
  `profileImagePublicId` varchar(500) DEFAULT NULL,
  `signatureUrl` varchar(1000) DEFAULT NULL,
  `signaturePublicId` varchar(500) DEFAULT NULL,
  `isOnline` tinyint NOT NULL DEFAULT '0',
  `lastSeen` datetime DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL,
  `resetPasswordOtp` varchar(10) DEFAULT NULL,
  `resetPasswordOtpExpires` datetime DEFAULT NULL,
  `emailVerificationOtp` varchar(10) DEFAULT NULL,
  `emailVerificationOtpExpires` datetime DEFAULT NULL,
  `isEmailVerified` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Sumit Kumar','singhsumit0042@gmail.com','$2b$10$YSKYWWduErpOI7QEnF16U.QF8JLHZpZYc/.6hdjF9L907zPmu720q','admin','$2b$10$UCx4W568lVSuC3fIio9L0.yIONafn7UjXE38bObP0xY1qK302rHt2','https://res.cloudinary.com/n2trwj6s/image/upload/v1786014921/learnhub/profiles/eimxjs0wcc3x2cezvbfj.jpg','learnhub/profiles/eimxjs0wcc3x2cezvbfj',NULL,NULL,0,'2026-08-13 14:38:13','2026-08-07 13:00:24.542088',NULL,NULL,NULL,NULL,NULL,NULL,1),(2,'sumit','sumit2004045@gmail.com','$2b$10$PHj2.Xlru9F3mIjszyTFlOMmjO1m8CygbrsYHPnK2ifALhMMCOcbm','student','$2b$10$cN2g62k7jnX1gNGcOD2g8..ACR4cAakZBXWpWRPbkwI7AaUlyueGG','https://res.cloudinary.com/n2trwj6s/image/upload/v1786526274/learnhub/profiles/jt9pscvyfrjytcafbcjn.jpg','learnhub/profiles/jt9pscvyfrjytcafbcjn',NULL,NULL,1,'2026-08-13 14:40:40','2026-08-07 13:00:24.542088',NULL,NULL,NULL,NULL,NULL,NULL,1),(3,'Sonu Tatiwal','tatiwalsonu981@gmail.com','$2b$10$IlKAP8xAIrvy4klxjHO3WORFA5JCvnvVejlA8ddJG8GX2Aa.nDJfq','teacher','$2b$10$LoLhpeMXFzUpNyb/mtnvouI6pb8ww0yNDMQM/LoAnaWhxTjnxYerS','https://res.cloudinary.com/n2trwj6s/image/upload/v1786016477/learnhub/profiles/wrqpk4lng2lbmp0hkefs.jpg','learnhub/profiles/wrqpk4lng2lbmp0hkefs','https://res.cloudinary.com/n2trwj6s/image/upload/v1786018679/learnhub/signatures/hmmslovvxjjbv0gbtsf5.jpg','learnhub/signatures/hmmslovvxjjbv0gbtsf5',0,'2026-08-13 14:38:13','2026-08-07 13:00:24.542088',NULL,NULL,NULL,NULL,NULL,NULL,1),(6,'samrat','samratsumit2024@gmail.com','$2b$10$oEwJzzXmomeqQ260RVXeLu29A.Vs5Q1KAvOLrwPDGyThF0ItMWlPm','teacher','$2b$10$ZjlnoNaoc8oGPGLogBdO0eelP0QD5ydT.xuq.ibsStp5L/Ov1w6n6',NULL,NULL,NULL,NULL,0,'2026-08-13 14:38:13','2026-08-08 17:03:34.940185',NULL,NULL,NULL,NULL,NULL,NULL,1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `video`
--

DROP TABLE IF EXISTS `video`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `video` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `videoUrl` text NOT NULL,
  `publicId` varchar(255) NOT NULL,
  `courseId` int NOT NULL,
  `duration` int DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video`
--

LOCK TABLES `video` WRITE;
/*!40000 ALTER TABLE `video` DISABLE KEYS */;
INSERT INTO `video` VALUES (1,'java dsa','learn and grow with LearnHub','https://res.cloudinary.com/n2trwj6s/video/upload/v1786017387/learnhub/videos/krnzp2epi4m4pcfyfyal.mp4','learnhub/videos/krnzp2epi4m4pcfyfyal',1,326,'2026-08-06 17:26:28.688783','2026-08-06 17:26:28.688783'),(2,'djoqwjd','djqod','https://res.cloudinary.com/n2trwj6s/video/upload/v1786446373/learnhub/videos/oiyokuwyxnkpzshuobfs.mp4','learnhub/videos/oiyokuwyxnkpzshuobfs',4,343,'2026-08-11 16:36:15.175095','2026-08-11 16:36:15.175095');
/*!40000 ALTER TABLE `video` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `video_progress`
--

DROP TABLE IF EXISTS `video_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `video_progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `videoId` int NOT NULL,
  `watchedPercentage` float NOT NULL DEFAULT '0',
  `completed` tinyint NOT NULL DEFAULT '0',
  `completedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_f89ca9b64bb0bd780cc087c591` (`userId`,`videoId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video_progress`
--

LOCK TABLES `video_progress` WRITE;
/*!40000 ALTER TABLE `video_progress` DISABLE KEYS */;
INSERT INTO `video_progress` VALUES (1,2,1,100,1,'2026-08-06 17:45:50'),(2,2,2,100,1,'2026-08-11 16:36:54');
/*!40000 ALTER TABLE `video_progress` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-13 17:16:08
