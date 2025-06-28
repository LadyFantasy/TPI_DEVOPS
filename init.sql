-- Script de inicialización de la base de datos PPIV
-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS ppiv_db;
USE ppiv_db;
-- Tabla de administradores
CREATE TABLE `admin` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `username` VARCHAR(30) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `superUser` TINYINT NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`),
  CONSTRAINT `username` UNIQUE (`username`)
);
-- Tabla de huéspedes
CREATE TABLE `guest` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`),
  CONSTRAINT `email` UNIQUE (`email`)
);
-- Tabla de unidades
CREATE TABLE `unit` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `rooms` INT NOT NULL,
  `beds` INT NOT NULL,
  `description` TEXT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `amenities` VARCHAR(2000) NULL,
  `urls_fotos` VARCHAR(2000) NULL,
  `title` VARCHAR(250) NOT NULL,
  `bathrooms` INT NOT NULL,
  `address` TEXT NOT NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`),
  CONSTRAINT `unico` UNIQUE (`title`)
);
-- Tabla de reservas
CREATE TABLE `reservation` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `unit_id` INT NOT NULL,
  `guest_id` INT NOT NULL,
  `check_in_date` DATE NOT NULL,
  `check_out_date` DATE NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `amount_paid` DECIMAL(10, 2) NOT NULL,
  `checked_in` TINYINT NOT NULL DEFAULT 0,
  `canceled` TINYINT NOT NULL DEFAULT 0,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`)
);
-- Tabla de tarifas por temporada
CREATE TABLE `season_rates` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `since` DATE NOT NULL,
  `until` DATE NOT NULL,
  `multiplier` FLOAT NOT NULL DEFAULT 1,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`)
);
-- Tabla de encuestas
CREATE TABLE `survey` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `reservation_id` INT NOT NULL,
  `question1` VARCHAR(255) NULL,
  `question2` VARCHAR(255) NULL,
  `question3` VARCHAR(255) NULL,
  `question4` VARCHAR(255) NULL,
  `question5` VARCHAR(255) NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`),
  CONSTRAINT `UQ_survey_reservation_id` UNIQUE (`reservation_id`)
);
-- Agregar foreign keys
ALTER TABLE `reservation`
ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reservation`
ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`guest_id`) REFERENCES `guest` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `survey`
ADD CONSTRAINT `survey_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
-- Insertar datos reales de admin
INSERT INTO `admin` (`id`, `username`, `password`, `superUser`)
VALUES (
    6,
    'guillermo.fullstack@gmail.com',
    'scrypt:32768:8:1$Jz9TRRg38XiU2RbY$2488383c45cac01f144e3b36f08fcf2ddb0b5d24ed07ab9a5c3d9885380ba5680a6aa3636c816acb020f2560807e6f14de313fe74409ca11be5e916264b50a15',
    1
  ),
  (
    8,
    'germangp62@gmail.com',
    'scrypt:32768:8:1$5OkJCffKGdO9GZbt$23e09681112c5677d0d936e1aca5c85b3fe4b2d9a6b803be6041c599a0df44d57592b4aa77baf685249748cad59ecf51fd4aebddf14cd04950cb8ce4503ca4e0',
    1
  ),
  (
    9,
    'germangp622@gmail.com',
    'scrypt:32768:8:1$KZVFNvvqG8l7TqTG$04a8528d9a744a72ae4a9055e08a88855da4ccfc137db822b8fe8450a7a738c8a9adc3a4193e95cb29b3d9a76cc042ea004bce5625c68237436f7368a3224358',
    0
  ),
  (
    12,
    'msoledadm88@gmail.com',
    'scrypt:32768:8:1$IZ8V0I2Mnam8F8Bh$b591ac481405d260288a7fa3f316a928748cb4627a0a12eb90eefd349f3fb7d076d0f201d14cedc5c2a24f98e8869da6d147585303376c4eca2d5ed2c43157f6',
    1
  ),
  (
    14,
    'carol.ceron801@gmail.com',
    'scrypt:32768:8:1$YxjmebwdoNTwOqGV$facdd0bb0150cbcfc74dfc5724206a12a059b3cc77e71208caa4100675af75438005067e8837b316bb749c0e3f3e3e717f4734e4afad3d9014dd7787d4bc6a35',
    1
  ),
  (
    36,
    'otrouser@mail.com',
    'scrypt:32768:8:1$0vV17ZsM4OaHfPc7$f12b50ead5210bdc23a9bea2a6fcf2cbe4f298bdfe8a118301d6aa439a5bcb200f3472753e7969e8059792711705d5f2f146afb53921c26e49510dd4f41016ac',
    0
  ),
  (
    40,
    'admin2@mail.com',
    'scrypt:32768:8:1$eS1gga6jrmAD0fPM$5363184209ada0fe7e3edbe13f426a3a3e0c222b7fa568b1d25fe04025292e82c9611f18889e12e1e5d79fd2bf4b9de8eb2663c10a8266f852aa31b0b7801d96',
    0
  ),
  (
    41,
    'admin@mail.com',
    'scrypt:32768:8:1$zXE8xy77Da7htVS1$8be0bb86f26c9031e55114c035869113e92aeb85c018a859c0c94307a6ede0c8398a4ba396be340030cfdd366c4e5fde886f6b85cfd2c6245b96a822e239016e',
    1
  );
-- Insertar datos reales de guest
INSERT INTO `guest` (`id`, `name`, `email`, `phone`)
VALUES (
    1,
    'Guillermo',
    'guillermo.fullstack@gmail.com',
    '12345678'
  ),
  (
    2,
    'Carol',
    'carol.ceron801@gmail.com',
    '12345678'
  ),
  (3, 'Sole', 'msoledadm88@gmail.com', '12345678'),
  (4, 'Germán', 'germangp62@gmail.com', '12345678');
-- Insertar datos reales de unit
INSERT INTO `unit` (
    `id`,
    `rooms`,
    `beds`,
    `description`,
    `price`,
    `amenities`,
    `urls_fotos`,
    `title`,
    `bathrooms`,
    `address`
  )
VALUES (
    6,
    8,
    4,
    'Casa con pileta ',
    666.00,
    '"lavarropa,gimnasio,incluye desayuno,detector de humo,parrilla"',
    'https://res.cloudinary.com/damlscz2d/image/upload/v1748141584/uq6sn6b0sepayuljoyod.jpg,https://res.cloudinary.com/damlscz2d/image/upload/v1748675650/griqevgekvwucxc3izbj.jpg',
    'Casa Armonía',
    2,
    'Corrientes 1234'
  ),
  (
    26,
    6,
    2,
    'cabañita',
    444.00,
    '"aire acondicionado,wifi,hidromasaje/jacuzzi,lavarropa,cocina,servicio de habitaciones"',
    'https://res.cloudinary.com/damlscz2d/image/upload/v1750697982/hx6v1r5mguaicmtqd7s3.jpg,https://res.cloudinary.com/damlscz2d/image/upload/v1750697991/ixazmihmmdksdpe1accy.jpg,https://res.cloudinary.com/damlscz2d/image/upload/v1750697997/jmvhqhwwhfrijks9tnwi.jpg',
    'Cabaña ',
    1,
    'Calle Falsa'
  ),
  (
    28,
    6,
    7,
    '',
    5757.00,
    '"aire acondicionado,hidromasaje/jacuzzi,parking,parrilla,gimnasio,incluye desayuno"',
    'https://res.cloudinary.com/damlscz2d/image/upload/v1748645680/e2fgpeh0dwrvpcunco5g.jpg,https://res.cloudinary.com/damlscz2d/image/upload/v1748645688/umo3yadqskemvyua1hpa.jpg,https://res.cloudinary.com/damlscz2d/image/upload/v1750697839/xhgk8spoha2oiwuivxbz.jpg,https://res.cloudinary.com/damlscz2d/image/upload/v1750697848/itttysjw6lbxwrhfmsht.jpg',
    'Casa moderna',
    1,
    'Calle Falsa'
  ),
  (
    29,
    5,
    7,
    'Frescura y espacio para tu vehículo',
    6666.00,
    '"parking,piscina,balcon,incluye desayuno"',
    'https://res.cloudinary.com/damlscz2d/image/upload/v1749036731/chs33pfebshtbap4klyy.jpg,https://res.cloudinary.com/damlscz2d/image/upload/v1749036739/kjbaqkgtxpddefujokri.jpg',
    'Casa Azul',
    3,
    'calle falsa'
  ),
  (
    30,
    8,
    8,
    'casa en la monta',
    8888.00,
    '"parking,piscina,balcon"',
    'https://res.cloudinary.com/damlscz2d/image/upload/v1749928818/iqi27tf18fc9yow0ylak.jpg',
    'casa sur',
    2,
    'bariloche'
  ),
  (
    52,
    4,
    4,
    'rfsfs',
    87952.00,
    '"parking,hidromasaje/jacuzzi,piscina,admite mascotas,balcon,lavarropa"',
    'https://res.cloudinary.com/damlscz2d/image/upload/v1749930553/l0rsfwnmzgwil42vh74f.jpg',
    'casa norte',
    1,
    'sdfsf'
  ),
  (
    54,
    1,
    1,
    'fesegdg',
    456456.00,
    '"parking,parrilla,piscina,admite mascotas,balcon,lavarropa"',
    'https://res.cloudinary.com/damlscz2d/image/upload/v1750224674/b6o6w6zxm7gdfzuwzpig.jpg',
    'casa rosada',
    1,
    'ertyet'
  ),
  (
    65,
    2,
    4,
    '0',
    1000.00,
    '"cocina,baño,balcon,ducha"',
    '[https://res.cloudinary.com/damlscz2d/image/upload/v1748197928/chirx7dc3jc962z7xzmm.jpg]',
    'Cabaña estilo americana con vista al lago',
    2,
    'Una calle'
  ),
  (
    67,
    2,
    4,
    '0',
    1000.00,
    '"cocina,baño,balcon,ducha"',
    '[https://res.cloudinary.com/...jpg]',
    'Cabaña estilo americana con vista al lago2025-06-27',
    2,
    'Una calle'
  );
-- Insertar datos reales de reservation
INSERT INTO `reservation` (
    `id`,
    `unit_id`,
    `guest_id`,
    `check_in_date`,
    `check_out_date`,
    `price`,
    `amount_paid`,
    `checked_in`,
    `canceled`
  )
VALUES (
    6,
    6,
    1,
    '2025-01-24',
    '2026-02-01',
    500.00,
    250.00,
    0,
    0
  ),
  (
    7,
    6,
    1,
    '2026-02-24',
    '2026-03-01',
    500.00,
    250.00,
    1,
    0
  ),
  (
    8,
    29,
    1,
    '2026-02-24',
    '2026-03-01',
    13330978.00,
    250.00,
    0,
    1
  ),
  (
    9,
    26,
    1,
    '2025-06-16',
    '2025-06-18',
    777.00,
    250.00,
    1,
    0
  ),
  (
    10,
    28,
    2,
    '2025-06-16',
    '2025-06-18',
    992.00,
    250.00,
    0,
    0
  ),
  (
    11,
    29,
    3,
    '2025-06-16',
    '2025-06-18',
    11666999.00,
    250.00,
    1,
    0
  ),
  (
    12,
    30,
    4,
    '2025-06-16',
    '2025-06-18',
    15554.00,
    250.00,
    1,
    0
  ),
  (
    13,
    26,
    4,
    '2025-06-20',
    '2025-06-25',
    652.00,
    250.00,
    0,
    1
  ),
  (
    14,
    28,
    2,
    '2025-06-20',
    '2025-06-25',
    833.00,
    250.00,
    0,
    1
  ),
  (
    15,
    29,
    3,
    '2025-06-20',
    '2025-06-25',
    9791666.00,
    250.00,
    1,
    0
  ),
  (
    16,
    30,
    1,
    '2025-06-20',
    '2025-06-25',
    13054.00,
    250.00,
    1,
    1
  ),
  (
    17,
    26,
    1,
    '2025-06-20',
    '2025-06-25',
    3020.00,
    250.00,
    0,
    0
  ),
  (
    18,
    26,
    1,
    '2025-09-20',
    '2025-09-25',
    2405.00,
    250.00,
    0,
    0
  ),
  (
    19,
    28,
    1,
    '2025-09-20',
    '2025-09-25',
    31665.00,
    250.00,
    0,
    0
  );
-- Insertar datos reales de season_rates
INSERT INTO `season_rates` (`id`, `since`, `until`, `multiplier`)
VALUES (437, '2025-06-08', '2025-06-13', 1.5),
  (438, '2025-08-03', '2025-08-07', 0.6),
  (439, '2025-09-09', '2025-09-13', 2),
  (440, '2025-08-19', '2025-08-23', 1.5),
  (441, '2025-07-16', '2025-07-16', 3),
  (442, '2025-06-20', '2025-06-26', 2),
  (443, '2025-07-06', '2025-07-11', 2);
-- Insertar datos reales de survey
INSERT INTO `survey` (
    `id`,
    `reservation_id`,
    `question1`,
    `question2`,
    `question3`,
    `question4`,
    `question5`
  )
VALUES (5, 6, '3', '4', '2', '1', '7'),
  (10, 10, '3', '4', '2', '1', '7'),
  (11, 7, '2', '3', '2', '3', '2'),
  (16, 12, '3', '2', '3', '3', '3'),
  (21, 16, '3', '4', '2', '1', '7'),
  (23, 8, '3', '2', '2', '3', '3'),
  (28, 15, '3', '4', '2', '1', '7');
-- Crear índices para mejorar el rendimiento
CREATE INDEX `idx_reservation_dates` ON `reservation`(`check_in_date`, `check_out_date`);
CREATE INDEX `idx_reservation_unit` ON `reservation`(`unit_id`);
CREATE INDEX `idx_reservation_guest` ON `reservation`(`guest_id`);
CREATE INDEX `idx_unit_price` ON `unit`(`price`);
CREATE INDEX `idx_admin_username` ON `admin`(`username`);
CREATE INDEX `idx_guest_email` ON `guest`(`email`);