-- Títulos y descripciones profesionales para las 25 propiedades de la carga inicial,
-- y corrección de datos que contradecían su propia descripción (áreas copiadas, m² registrados como varas, habitaciones y baños).
UPDATE properties SET title = 'Residencia en condominio privado en Elgin, Zona 13', description = 'Una residencia de 300 m² dentro de un condominio privado en Zona 13, pensada para la vida familiar con amplitud y privacidad.

Los ambientes sociales se integran entre sí y se abren hacia la pérgola y el jardín, con buena entrada de luz natural en toda la casa.

## Área social
- Vestíbulo de ingreso
- Sala principal y comedor integrado
- Cocina con acceso directo a pérgola y jardín
- Sala familiar con baño completo

## Área privada
- Habitación principal con baño privado y doble walk-in closet
- Dos habitaciones secundarias, cada una con baño privado y clóset
- Clóset de blancos

## Exterior
- Pérgolas laterales para reuniones y descanso
- Jardín con acceso desde comedor y cocina', area_built_m2 = 300, bedrooms = 3, bathrooms = 4, updated_at = datetime('now') WHERE slug = 'zona13-elgin' AND source = 'import-wix';
UPDATE properties SET title = 'Residencia con sótano multifuncional en El Socorro', description = 'Residencia de 176 m² en El Socorro, Santa Catarina Pinula, con una distribución que separa con claridad la vida social, familiar y de servicio.

Su sótano con baño amplía las posibilidades de uso: oficina privada, estudio, sala de entretenimiento o un ambiente independiente según las necesidades de cada familia.

## Área social
- Sala principal y comedor
- Cocina y área de lavandería independiente
- Patio interior que aporta luz y ventilación
- Baño de visitas

## Área familiar
- Dormitorio principal con walk-in closet, baño privado y terraza
- Dos dormitorios secundarios, cada uno con baño y clóset
- Dos salas familiares

## Nivel inferior
- Sótano multifuncional con baño
- Dormitorio de servicio con baño

## Equipamiento
- Parqueo para 2 vehículos
- Cisterna y pozo de agua propio
- Portón eléctrico

## Condiciones
- Precio negociable', updated_at = datetime('now') WHERE slug = 'elsocorro' AND source = 'import-wix';
UPDATE properties SET title = 'Granja con casa y bodega en El Manzanillo, Mixco', description = 'Terreno de 2,457 m² en El Manzanillo, Mixco, con casa principal, bodega independiente y accesos desde San Lucas y desde Mixco.

Su topografía ascendente, de alrededor de 65 %, permite proyectar terrazas, áreas escalonadas o una construcción orientada a las vistas. Se presta para granja, casa de descanso o un proyecto familiar de largo plazo.

## Terreno
- Área total: 2,457 m²
- Frente de 20 m y fondo de 136 m
- Topografía inclinada ascendente
- Muro perimetral en toda la propiedad

## Construcciones
- Casa principal con 2 habitaciones y 2 baños
- Sala, comedor y cocina
- Bodega independiente

## Infraestructura
- Pozo artesanal y depósito de agua
- Fosa séptica

## Condiciones
- Precio más timbres y gastos de ley
- Precio negociable', area_built_m2 = NULL, area_land_v2 = 3516, updated_at = datetime('now') WHERE slug = 'manzanillo' AND source = 'import-wix';
UPDATE properties SET title = 'Terreno de 12 manzanas sobre carretera en San Jerónimo, Baja Verapaz', description = 'Doce manzanas en jurisdicción de San Jerónimo, Baja Verapaz, con acceso directo sobre carretera principal y vistas despejadas, a pocos minutos de Aldea Santa Bárbara.

Por su extensión y entorno natural, el terreno puede analizarse para uso agrícola, forestal, turístico o para un desarrollo habitacional de baja densidad con enfoque sostenible.

## Terreno
- Área total: 12 manzanas
- Acceso sobre carretera principal
- Entorno abierto con vistas despejadas
- Servicios en las cercanías

## Usos posibles
- Casa de descanso
- Proyecto agrícola, forestal o granja
- Hospedaje o turismo rural
- Desarrollo habitacional de baja densidad

## Condiciones
- Papelería en orden
- Precio negociable', area_built_m2 = NULL, parking = NULL, levels = NULL, updated_at = datetime('now') WHERE slug = 'san-jeronimo' AND source = 'import-wix';
UPDATE properties SET title = 'Casa familiar con jardín en Asunción Mita, Jutiapa', description = 'Casa de un nivel en Asunción Mita, Jutiapa, en un entorno residencial tranquilo y con los servicios del municipio a corta distancia.

Su jardín y su parqueo propio la hacen práctica para la vida familiar diaria.

## Distribución
- 3 habitaciones
- Sala familiar
- Cocina equipada

## Exterior
- Jardín
- Parqueo propio

## Condiciones
- Papelería en orden
- Disponibilidad inmediata
- Precio negociable', updated_at = datetime('now') WHERE slug = 'asuncion-mita' AND source = 'import-wix';
UPDATE properties SET title = 'Finca con potencial de urbanización en Chimaltenango', description = 'Finca en Chimaltenango con potencial de urbanización y acceso estratégico, orientada a inversionistas y desarrolladores con visión de largo plazo.', updated_at = datetime('now') WHERE slug = 'finca-chimaltenango' AND source = 'import-wix';
UPDATE properties SET title = 'Residencia con piscina en Kanajuyú, Zona 16', description = 'Residencia dentro de garita con acceso controlado en Kanajuyú, Zona 16, rodeada de áreas verdes y con piscina privada.

La planta baja concentra las áreas sociales y de entretenimiento con salida al jardín; el segundo nivel reserva la vida familiar, con cuatro habitaciones y sala propia.

## Primer nivel
- Sala principal con chimenea
- Comedor con salida directa al jardín
- Cocina amplia con despensa y pantry con acceso al jardín
- Estudio privado
- Cuarto de juegos o man cave
- Baño de visitas
- Lavandería y área de servicio

## Segundo nivel
- Sala familiar con chimenea
- Master suite con baño privado, tina y regadera, y walk-in closet
- Dos habitaciones con clóset y baño compartido con doble regadera
- Cuarta habitación con baño privado

## Exterior
- Piscina privada
- Jardín rodeado de naturaleza

## Seguridad y equipamiento
- Parqueo para 6 vehículos, 3 bajo techo
- 4 portones eléctricos
- Puerta peatonal blindada
- Calentador de paso en cada baño y en la cocina

## Condiciones
- Precio negociable', parking = 6, bathrooms = 3.5, levels = 2, updated_at = datetime('now') WHERE slug = 'kanajuyu-16' AND source = 'import-wix';
UPDATE properties SET title = 'Residencia colonial en Hacienda Nueva Country Club', description = 'Residencia de estilo colonial en Hacienda Nueva Country Club, San José Pinula, un entorno residencial con campo de golf, casa club y salón de eventos.

La casa se organiza alrededor de un patio interior con jardinera y fuente, con pérgolas y jardín que extienden la vida social hacia el exterior.

## Primer nivel
- Sala y comedor
- Patio interior con jardinera y fuente
- Cocina, despensa y pantry
- Estudio
- Baño de visitas
- Lavandería, patio de tender y cuarto de servicio con baño
- Bodega

## Segundo nivel
- Habitación principal con walk-in closet, baño, chimenea, balcón e instalación para jacuzzi
- Dos habitaciones con clóset y baño compartido
- Sala familiar con chimenea y salida a balcón

## Exterior
- Dos pérgolas y jardín
- Garage para 4 vehículos, 2 bajo techo

## Amenidades del entorno
- Campo de golf
- Casa club
- Salón para eventos

## Costos de mantenimiento
- Mantenimiento: Q882 mensuales
- IUSI: Q1,158.72 trimestrales', updated_at = datetime('now') WHERE slug = 'hacienda-nueva' AND source = 'import-wix';
UPDATE properties SET title = 'Villas de Alcalá: casas en condominio, km 16.5 Carretera a El Salvador', description = 'Proyecto residencial en el km 16.5 de Carretera a El Salvador, cerca de colegios, universidades y plazas comerciales, con amenidades pensadas para la vida familiar.

Ofrece dos modelos de dos niveles, con precios desde US$270,000 hasta US$390,000 según el modelo.

## Casa Sevilla · 240 m²
- Garage techado para 2 vehículos
- Sala, comedor y porche
- Cocina con gabinetes y despensa
- Jardín trasero de 95.10 m²
- Habitación máster con baño completo, balcón y walk-in closet
- Dos habitaciones con clóset, balcón y baño compartido
- Sala familiar y estudio
- Cuarto de servicio con baño completo

## Casa Asturias · 300 m²
- Garage techado para 4 vehículos
- Sala, comedor y pérgola
- Cocina con gabinetes, desayunador y despensa
- Jardín trasero de 140 m²
- Habitación máster con baño completo, balcón y walk-in closet
- Dos habitaciones con clóset, balcón y baño compartido
- Sala familiar y estudio
- Cuarto de servicio con baño completo

## Amenidades del proyecto
- Casa club para 100 personas
- Coworking center y game center
- Sala de belleza
- Área pet friendly
- Área verde con juegos infantiles

## Nota
- Las fotografías son de referencia', updated_at = datetime('now') WHERE slug = 'villas-alcala' AND source = 'import-wix';
UPDATE properties SET title = 'Residencia con vista al valle y apartamento independiente en San Cristóbal', description = 'Residencia de 405 m² de construcción en San Cristóbal B-7, Zona 8 de Mixco, en calle cerrada con garita y con vista al valle.

Además de la vivienda principal, incluye un apartamento independiente con sala, dormitorio y baño, útil para visitas, un familiar, una oficina privada o renta.

## Datos clave
- Terreno de 356 m² (14 × 28 m)
- Garage techado para 3 vehículos
- Cercana a supermercados, restaurantes y centros educativos

## Primer nivel
- Sala con chimenea funcional
- Comedor de 6 × 5 m
- Cocina de 3 × 6 m con gabinetes fundidos y de madera sólida
- Estudio o dormitorio con baño completo
- Baño de visitas
- Lavandería y patio

## Segundo nivel
- Sala familiar
- Dormitorio principal con baño privado y bay window con vista al valle
- Dormitorio con baño privado y terraza
- Dos dormitorios secundarios con baño compartido

## Apartamento independiente
- Sala
- Dormitorio con clóset
- Baño privado

## Exterior y equipamiento
- Jardín de 9 × 10 m
- Pérgola con churrasquera
- Cisterna con bomba hidroneumática
- Conexión para gas propano

## Condiciones
- Precio más timbres y gastos de ley
- Precio negociable', area_land_v2 = 509, updated_at = datetime('now') WHERE slug = 'san-cristobal' AND source = 'import-wix';
UPDATE properties SET title = 'Residencia remodelada con vista al bosque en Santa Rosalía, km 12.5', description = 'Residencia de 460 m² sobre 800 varas en Santa Rosalía, km 12.5 de Carretera a El Salvador, con vista al bosque y lista para habitar.

La remodelación abarcó los elementos que más pesan en una compra: sistema eléctrico, pisos, ventanería, cocina y clósets.

## Distribución
- Sala principal y comedor
- Cocina remodelada
- Estudio
- Sala familiar
- Master suite con walk-in closet
- Tres habitaciones, cada una con baño privado
- Lavandería independiente

## Exterior
- Pérgola y jardín con vista al bosque
- Parqueo para 2 vehículos

## Remodelación
- Sistema eléctrico renovado
- Pisos y ventanería nuevos
- Cocina y clósets actualizados

## Condiciones
- Pozo propio
- Sin gravámenes
- Precio negociable', updated_at = datetime('now') WHERE slug = 'santa-rosalia' AND source = 'import-wix';
UPDATE properties SET title = 'Casa de playa amueblada en Condominio Alta Mar, Chulamar', description = 'Casa de playa en el km 4.5 de Carretera a Chulamar, Puerto de San José, dentro de un condominio con acceso privado al mar y seguridad las 24 horas.

Se entrega amueblada y equipada, con piscina privada y áreas sociales abiertas. Funciona como casa familiar de playa, residencia vacacional o propiedad para renta de corta estancia.

## Primer nivel
- Sala, comedor y cocina integrados
- Área de estar frente a la piscina
- Dos habitaciones, cada una con baño
- Pérgola con churrasquera
- Cuarto de filtro con baño y ducha exterior
- Jardín

## Segundo nivel
- Sala amplia
- Terraza con área de hamacas y vista a la piscina
- Dos habitaciones, cada una con baño

## Piscina y condominio
- Piscina privada de 4.25 × 8 m
- Dos piscinas sociales con toboganes
- Acceso privado directo al mar
- Áreas de recreación
- Seguridad 24 horas

## Condiciones
- Incluye muebles, equipo y menaje
- Precio flexible para compradores calificados', area_built_m2 = NULL, updated_at = datetime('now') WHERE slug = 'chulamar' AND source = 'import-wix';
UPDATE properties SET title = 'Casa familiar con jardín amplio en Fontana 3', description = 'Casa de dos niveles en Fontana 3, sobre Carretera a El Salvador, con ambientes iluminados, jardín amplio y una distribución clara entre áreas sociales, privadas y de servicio.

Cuenta con ingreso independiente para el servicio de jardinería, lo que permite mantener el orden y la privacidad de la casa.

## Primer nivel
- Sala principal con buena iluminación natural
- Comedor integrado
- Cocina con acceso directo a lavandería
- Estudio u oficina
- Baño de visitas
- Lavandería con acceso desde el estacionamiento
- Cuarto de servicio con baño

## Segundo nivel
- Sala familiar
- Terraza con vista
- Habitación principal con walk-in closet y baño privado
- Dos habitaciones con baño compartido

## Exterior
- Pérgola para reuniones
- Jardín amplio
- Parqueo para 4 vehículos, 2 bajo techo', area_built_m2 = NULL, updated_at = datetime('now') WHERE slug = 'fontana3' AND source = 'import-wix';
UPDATE properties SET title = 'Casa en preventa en Calistemos, San Cristóbal', description = 'Casa de obra nueva en fase de planos en Calistemos, San Cristóbal, Zona 8 de Mixco, sobre el Boulevard Villa Deportiva y con conexión hacia Pinares y Balcones.

La preventa permite asegurar la propiedad antes de su entrega, con opciones de financiamiento y enganche fraccionado.

## Datos clave
- Construcción: 178 m² en 2 niveles
- Terreno de 6.5 m de frente por 27 m de fondo
- Parqueo para 2 vehículos
- Dentro de garita

## Planta baja
- Sala y comedor
- Cocina con isla y gabinetes
- Baño de visitas
- Habitación de servicio con baño completo
- Lavandería con conexión 220V y pila techada
- Patio trasero con pérgola y jardín con grama

## Planta alta
- Habitación principal con baño privado, walk-in closet y balcón
- Dos habitaciones con clóset, una con balcón
- Baño completo compartido

## Condiciones
- Precio más gastos de escrituración
- Opciones de financiamiento y enganche fraccionado
- Mantenimiento: Q200 mensuales, incluye seguridad y áreas comunes', area_built_m2 = 178, parking = 2, bathrooms = 2.5, updated_at = datetime('now') WHERE slug = 'san-cristobal2' AND source = 'import-wix';
UPDATE properties SET title = 'Casa remodelada en Campo Grande, Carretera a El Salvador', description = 'Casa remodelada de 110 m² en Campo Grande, Carretera a El Salvador, lista para habitar en un entorno residencial ordenado.

Su pérgola de 20 m² y el jardín privado amplían el uso diario de la casa hacia el exterior.

## Distribución
- 3 dormitorios
- 2.5 baños
- Sala y comedor
- Cocina
- Área de lavandería

## Exterior
- Jardín privado
- Pérgola de 20 m²
- Garage para 2 vehículos

## Condiciones
- Mantenimiento: Q995 mensuales, incluye agua, seguridad y mantenimiento de jardín', bathrooms = 2.5, updated_at = datetime('now') WHERE slug = 'campo-grande' AND source = 'import-wix';
UPDATE properties SET title = 'Casa con terreno adicional en Arrazola 2', description = 'Casa en Arrazola 2, sobre Carretera a El Salvador, en una colonia con áreas verdes y calles amplias. Incluye un terreno adicional a la par, útil para ampliar, sumar jardín o proyectar un área complementaria.

Cuatro habitaciones, cuatro baños completos y un estudio le dan capacidad para una familia amplia.

## Primer nivel
- Sala principal y comedor
- Cocina
- Baño de visitas
- Lavandería y bodega
- Cuarto de servicio con baño

## Segundo nivel
- Sala familiar
- Habitación principal con walk-in closet y baño privado
- Habitación con baño privado
- Dos habitaciones con baño compartido
- Estudio

## Exterior
- Jardín y terreno adicional a la par
- Parqueo para 3 vehículos bajo techo

## Condiciones
- Incluye 1 paja de agua
- Mantenimiento: Q200 mensuales
- IUSI: Q150 trimestrales', area_built_m2 = NULL, bathrooms = 4.5, updated_at = datetime('now') WHERE slug = 'arrazola2' AND source = 'import-wix';
UPDATE properties SET title = 'Casa amplia sobre Carretera a Olmeca', description = 'Casa de 400 m² de construcción sobre un terreno de 447 m², a 2 km de la entrada a Olmeca, con acceso directo sobre carretera.

Registrada y libre de gravámenes, con un costo de IUSI bajo; funciona como vivienda familiar o para analizar como inversión.

## Datos clave
- Terreno de 17 × 33 m
- 2 niveles
- Parqueo para 4 vehículos

## Primer nivel
- Sala y comedor
- Cocina
- Baño de visitas
- Clóset de almacenamiento y bodega
- Jardín

## Segundo nivel
- Sala familiar con balcón
- Dormitorio principal con baño privado, clóset y walk-in closet
- Dos dormitorios con clóset y baño compartido
- Dormitorio con espacio para estudio

## Condiciones
- Registrada y libre de gravámenes
- IUSI anual aproximado: Q375
- Precio negociable', area_land_v2 = 640, updated_at = datetime('now') WHERE slug = 'olmeca' AND source = 'import-wix';
UPDATE properties SET title = 'Residencia en El Prado, Zona 10', description = 'Residencia de 315 m² en Zona 10, una de las zonas más consolidadas de Ciudad de Guatemala, cerca de áreas corporativas, comercios y restaurantes.

Cada una de sus tres habitaciones tiene baño privado, y las áreas sociales, familiares y de servicio están bien separadas.

## Distribución
- Sala principal y comedor
- Cocina amplia y alacena
- Sala familiar
- Tres habitaciones con baño privado y clósets integrados
- Cuarto de servicio
- Bodega

## Exterior
- Pérgola
- Jardín
- Parqueo para 3 vehículos

## Condiciones
- Precio más impuestos
- Mantenimiento: Q1,400 mensuales
- IUSI: Q825 trimestrales
- Precio negociable', area_land_v2 = NULL, updated_at = datetime('now') WHERE slug = 'elprado' AND source = 'import-wix';
UPDATE properties SET title = 'Residencia sobre 3,000 varas en San Rafael II, Carretera a El Salvador', description = 'Residencia de 530 m² sobre un terreno de 3,000 varas² en San Rafael II, un sector de baja densidad sobre Carretera a El Salvador, cerca de centros comerciales, colegios y restaurantes.

Las cuatro habitaciones tienen baño privado, y dos de ellas están en el primer nivel: una ventaja para visitas o para quien prefiere evitar gradas.

## Áreas sociales
- Amplias áreas sociales con conexión a las áreas verdes
- Baño de visitas

## Habitaciones
- Dos habitaciones con baño privado en el primer nivel
- Dos habitaciones con baño privado en el segundo nivel

## Terreno
- 3,000 varas² con áreas verdes
- Espacio para jardín, áreas sociales o ampliaciones

## Condiciones
- Precio negociable', updated_at = datetime('now') WHERE slug = 'sanrafael' AND source = 'import-wix';
UPDATE properties SET title = 'Residencia en Vistas de San Isidro II, Zona 16', description = 'Residencia en Vistas de San Isidro II, Zona 16, un sector residencial muy valorado por su entorno y su conectividad.

Las áreas sociales se abren al jardín, a la pérgola y a un balcón; en el segundo nivel, cada una de las tres habitaciones tiene su propio baño.

## Primer nivel
- Sala principal con salida al jardín
- Comedor con acceso a pérgola
- Sala adicional con salida a balcón
- Cocina con pantry y acceso a pérgola
- Baño de visitas
- Patio, lavandería y habitación de servicio

## Segundo nivel
- Sala familiar
- Habitación principal con walk-in closet y baño privado con tina
- Dos habitaciones con clóset y baño privado

## Exterior
- Jardín privado con fuente
- Pérgola y terraza
- Parqueo para 3 vehículos

## Condiciones
- Precio más 3 % de timbres fiscales
- Acepta permuta
- Precio negociable', area_built_m2 = NULL, area_land_v2 = NULL, updated_at = datetime('now') WHERE slug = 'zona162' AND source = 'import-wix';
UPDATE properties SET title = 'Casa en Condominio Vizcaya, km 16.5 Carretera a El Salvador', description = 'Casa en Condominio Vizcaya, en el km 16.5 de Carretera a El Salvador, una zona de alta demanda residencial con acceso fácil y ambiente seguro.

La distribución separa con claridad los ambientes sociales, privados y de servicio, y se complementa con un jardín amplio con desnivel y una pérgola.

## Ambientes
- Áreas sociales
- Estudio
- Sala familiar
- Cuarto de servicio

## Exterior
- Jardín amplio con desnivel
- Pérgola

## Condiciones
- Precio negociable', updated_at = datetime('now') WHERE slug = 'vizcaya' AND source = 'import-wix';
UPDATE properties SET title = 'Residencia en Vista Hermosa III, Zona 15', description = 'Residencia de 270 m² en Vista Hermosa III, Zona 15, a pocos minutos de Ciudad Cayalá, la Embajada de Estados Unidos, universidades y centros comerciales.

Un jardín interior de doble altura ilumina el área social, que se completa con bar, pérgola y jardín posterior.

## Primer nivel
- Sala principal con chimenea
- Jardín interior de doble altura
- Comedor integrado
- Cocina equipada
- Bar
- Dormitorio de servicio con baño
- Lavandería y patio de tender

## Segundo nivel
- Sala familiar
- Dormitorio principal con baño privado y walk-in closet
- Dos dormitorios con baño compartido
- Bodega
- Terraza amplia

## Exterior
- Pérgola y jardín posterior
- 4 parqueos, 2 techados

## Condiciones
- Precio negociable', bedrooms = 3, updated_at = datetime('now') WHERE slug = 'zona15vh3' AND source = 'import-wix';
UPDATE properties SET title = 'Residencia de un nivel en San Cristóbal, Sector B1', description = 'Residencia de un nivel dentro de garita en el Sector B1 de San Cristóbal, Zona 8 de Mixco, en un entorno consolidado y con fácil acceso.

Sus 352 m² de construcción en una sola planta la hacen cómoda para toda la familia, sin gradas. El techo de madera tipo Ligmun le da un carácter cálido y residencial.

## Datos clave
- Terreno de 378 m² (13.5 × 28 m)
- Parqueo para 2 vehículos bajo techo y 2 al frente
- Portón eléctrico

## Distribución
- Sala principal y comedor
- Cocina y lavandería
- Sala familiar
- Habitación máster con baño privado y clóset
- Dos habitaciones con clóset y baño completo compartido
- Cuarto de servicio con baño completo

## Exterior y equipamiento
- Jardín y patio
- Cisterna

## Condiciones
- Precio más timbres y gastos de ley
- Precio negociable', area_land_v2 = 541, levels = 1, updated_at = datetime('now') WHERE slug = 'sancristobal-b1' AND source = 'import-wix';
UPDATE properties SET title = 'Casa de esquina con jardín plano en La Fontana, km 25.5', description = 'Casa de esquina de 170 m² sobre 529 varas² en La Fontana, km 25.5 de Carretera a El Salvador, con un jardín plano de buen aprovechamiento.

Dos accesos independientes al jardín hacen práctico su uso para reuniones y actividades al aire libre.

## Área social
- Sala principal y comedor
- Cocina
- Pérgola

## Área privada
- Habitación principal con walk-in closet y baño privado
- Dos habitaciones con clóset y baño compartido
- Sala familiar

## Exterior y servicio
- Jardín plano con dos accesos independientes
- Lavandería techada
- Garage para 4 vehículos

## Condiciones
- Precio más impuestos', updated_at = datetime('now') WHERE slug = 'fontana2' AND source = 'import-wix';
UPDATE properties SET title = 'Casa nueva con vista a los volcanes en Florencia, Milpas Altas', description = 'Casa nueva en una colonia residencial de Florencia, cerca de la Carretera Interamericana, con seguridad 24/7, senderos para caminar y vistas hacia los volcanes.

Tres niveles bien definidos: áreas sociales con sala de doble altura, habitaciones en el segundo nivel y una terraza con vista panorámica en el tercero.

## Planta baja
- Sala con doble altura
- Comedor
- Cocina con gabinetes fundidos y de madera
- Estudio
- Baño de visitas
- Bodega
- Jardín frontal
- Garaje techado para 3 vehículos

## Segundo nivel
- Sala familiar
- Habitación principal con clóset y baño privado
- Habitaciones secundarias
- Baño completo

## Tercer nivel
- Terraza con vista panorámica
- Lavandería

## Entorno
- Seguridad 24/7
- Áreas recreativas y senderos
- Vista a los volcanes', updated_at = datetime('now') WHERE slug = 'florencia' AND source = 'import-wix';
